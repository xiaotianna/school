import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiTitleSuggestDto } from '../dto/ai-title-suggest.dto';
import { AiRewriteDto } from '../dto/ai-rewrite.dto';
import { AiTagSuggestDto } from '../dto/ai-tag-suggest.dto';

type RateLimitRecord = {
  windowStart: number;
  count: number;
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly records = new Map<string, RateLimitRecord>();

  private readonly provider: string;
  private readonly ollamaBaseUrl: string;
  private readonly ollamaModel: string;
  private readonly timeoutMs: number;
  private readonly aiEnabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.provider = this.configService.get<string>('AI_PROVIDER', 'ollama');
    this.ollamaBaseUrl = this.configService.get<string>(
      'OLLAMA_BASE_URL',
      'http://127.0.0.1:11434',
    );
    this.ollamaModel = this.configService.get<string>(
      'OLLAMA_MODEL',
      'qwen3:0.6b',
    );
    const timeoutValue = this.configService.get<string | number>(
      'AI_TIMEOUT_MS',
      8000,
    );
    this.timeoutMs = Number(timeoutValue) || 8000;

    const enabledValue = this.configService.get<string | boolean>(
      'AI_ENABLED',
      true,
    );
    this.aiEnabled =
      enabledValue === true || String(enabledValue).toLowerCase() === 'true';
  }

  async titleSuggest(userId: string, dto: AiTitleSuggestDto) {
    this.assertEnabled();
    this.assertRateLimit(userId);

    const raw = await this.callModel('title-suggest', {
      draftTitle: dto.draftTitle,
      content: this.trimText(dto.content, 1200),
      style: dto.style ?? 'normal',
    });

    const suggestions = this.ensureStringArray(raw?.suggestions)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => item.slice(0, 20))
      .slice(0, 3);

    if (!suggestions.length) {
      throw new HttpException(
        '标题建议生成失败，请重试',
        HttpStatus.BAD_GATEWAY,
      );
    }

    while (suggestions.length < 3) {
      suggestions.push(`校园分享 ${suggestions.length + 1}`);
    }

    return { suggestions };
  }

  async rewrite(userId: string, dto: AiRewriteDto) {
    this.assertEnabled();
    this.assertRateLimit(userId);

    const payload = {
      title: dto.title,
      content: dto.content,
      goal: dto.goal,
      tone: dto.tone ?? 'normal',
    };

    const raw = await this.callModel('rewrite', payload);

    const rewritten = String(raw?.rewritten ?? '').trim();
    const highlights = this.ensureStringArray(raw?.highlights)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 5);

    if (!rewritten) {
      throw new HttpException('正文润色失败，请重试', HttpStatus.BAD_GATEWAY);
    }

    let finalRewritten = rewritten;
    if (dto.goal === 'expand') {
      finalRewritten = await this.ensureExpandedLength(payload, rewritten);
    }

    return {
      rewritten: finalRewritten,
      highlights,
    };
  }

  async rewriteStream(
    userId: string,
    dto: AiRewriteDto,
    onChunk: (chunk: string) => void,
  ) {
    this.assertEnabled();
    this.assertRateLimit(userId);

    const payload = {
      title: dto.title,
      content: dto.content,
      goal: dto.goal,
      tone: dto.tone ?? 'normal',
    };

    let rewritten = await this.callOllamaStream(
      'rewrite-stream',
      this.buildPrompt('rewrite-stream', payload),
      onChunk,
    );

    if (!rewritten.trim()) {
      throw new HttpException('正文润色失败，请重试', HttpStatus.BAD_GATEWAY);
    }

    if (dto.goal === 'expand') {
      rewritten = await this.ensureExpandedLengthStream(
        payload,
        rewritten,
        onChunk,
      );
    }
  }

  async tagSuggest(userId: string, dto: AiTagSuggestDto) {
    this.assertEnabled();
    this.assertRateLimit(userId);

    const raw = await this.callModel('tag-suggest', {
      title: dto.title,
      content: this.trimText(dto.content, 1200),
      maxTags: dto.maxTags ?? 5,
    });

    const tags = this.ensureStringArray(raw?.tags)
      .map((tag) => tag.trim().replace(/^#/, ''))
      .filter((tag) => tag.length > 0)
      .map((tag) => tag.slice(0, 10));

    const uniqueTags = Array.from(new Set(tags)).slice(
      0,
      Math.min(dto.maxTags ?? 5, 5),
    );

    return {
      tags: uniqueTags,
    };
  }

  private async callModel(task: string, payload: Record<string, any>) {
    if (this.provider !== 'ollama') {
      throw new ServiceUnavailableException('仅支持 ollama 作为 AI_PROVIDER');
    }

    const prompt = this.buildPrompt(task, payload);
    let lastError: Error | null = null;

    for (let i = 0; i < 2; i++) {
      try {
        const data = await this.callOllama(task, prompt);
        return this.parseTaskResult(task, data);
      } catch (error) {
        lastError = error as Error;
        if (!(error instanceof SyntaxError)) {
          break;
        }
      }
    }

    throw new HttpException(
      `AI 调用失败: ${lastError?.message ?? 'unknown error'}`,
      HttpStatus.BAD_GATEWAY,
    );
  }

  private async callOllama(task: string, prompt: string): Promise<string> {
    const requestTimeoutMs =
      task === 'rewrite' ? 0 : Math.max(this.timeoutMs, 12000);
    const numPredict = task === 'rewrite' ? -1 : 160;

    const controller = new AbortController();
    const timer = requestTimeoutMs
      ? setTimeout(() => controller.abort(), requestTimeoutMs)
      : null;

    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt,
          stream: false,
          format: 'json',
          options: {
            temperature: 0.3,
            num_predict: numPredict,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`ollama http status ${response.status}`);
      }

      const data = await response.json();
      return String(data?.response ?? '').trim();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('AI 响应超时');
      }
      throw error;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  private async callOllamaStream(
    task: string,
    prompt: string,
    onChunk: (chunk: string) => void,
  ): Promise<string> {
    const requestTimeoutMs = 0;
    const controller = new AbortController();
    const timer = requestTimeoutMs
      ? setTimeout(() => controller.abort(), requestTimeoutMs)
      : null;

    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt,
          stream: true,
          options: {
            temperature: 0.3,
            num_predict: task === 'rewrite-stream' ? -1 : 256,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`ollama stream http status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          try {
            const item = JSON.parse(trimmed);
            const chunk = String(item?.response ?? '');
            if (chunk) {
              fullText += chunk;
              onChunk(chunk);
            }
          } catch {
            // ignore malformed line and continue streaming
          }
        }
      }

      if (buffer.trim()) {
        try {
          const item = JSON.parse(buffer.trim());
          const chunk = String(item?.response ?? '');
          if (chunk) {
            fullText += chunk;
            onChunk(chunk);
          }
        } catch {
          // ignore tail parse error
        }
      }

      return fullText;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('AI 响应超时');
      }
      throw error;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  private parseJsonStrict(raw: string): any {
    const text = raw.trim();

    try {
      return JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new SyntaxError('模型未返回 JSON');
      }
      return JSON.parse(match[0]);
    }
  }

  private parseTaskResult(task: string, raw: string): any {
    try {
      return this.parseJsonStrict(raw);
    } catch {
      const cleaned = this.cleanModelOutput(raw);
      if (!cleaned) {
        throw new SyntaxError('模型未返回 JSON');
      }

      if (task === 'rewrite') {
        return {
          rewritten: cleaned,
          highlights: [],
        };
      }

      if (task === 'title-suggest') {
        const suggestions = this.extractListItems(cleaned, 3).slice(0, 3);
        if (!suggestions.length) {
          throw new SyntaxError('模型未返回 JSON');
        }
        return { suggestions };
      }

      if (task === 'tag-suggest') {
        const tags = this.extractTags(cleaned).slice(0, 8);
        if (!tags.length) {
          throw new SyntaxError('模型未返回 JSON');
        }
        return { tags };
      }

      throw new SyntaxError('模型未返回 JSON');
    }
  }

  private buildPrompt(task: string, payload: Record<string, any>) {
    const jsonPayload = JSON.stringify(payload, null, 2);

    if (task === 'title-suggest') {
      return `你是校园墙写作助手。基于输入内容生成3个中文标题。\n要求：每个标题<=20字，语气自然，避免夸张营销。\n仅返回JSON：{"suggestions":["...","...","..."]}\n输入：${jsonPayload}`;
    }

    if (task === 'rewrite') {
      return `你是校园墙写作助手。按目标改写正文，保持事实，不要编造。\n输出需支持富文本格式，请使用 Markdown（可用标题、分段、列表、加粗）。\n如果 goal=expand，输出正文不少于500字。\n仅返回JSON：{"rewritten":"...","highlights":["...","..."]}\n输入：${jsonPayload}`;
    }

    if (task === 'rewrite-stream') {
      return `你是校园墙写作助手。按目标改写正文，保持事实，不要编造。直接输出润色后的 Markdown 正文，不要解释，不要JSON，不要代码块。\n输出需支持富文本格式，请使用 Markdown（可用标题、分段、列表、加粗）。\n如果 goal=expand，输出正文不少于500字。\n输入：${jsonPayload}`;
    }

    if (task === 'rewrite-expand-continue') {
      return `你是校园墙写作助手。请基于“当前扩写结果”继续补写，直到总字数不少于500字。\n要求：连贯、同一主题、不重复已有句子；输出支持富文本格式并使用 Markdown。\n仅返回JSON：{"rewritten":"..."}\n输入：${jsonPayload}`;
    }

    if (task === 'rewrite-stream-continue') {
      return `你是校园墙写作助手。请基于“当前扩写结果”继续补写，直到总字数不少于500字。\n要求：连贯、同一主题、不重复已有句子；输出支持富文本格式并使用 Markdown。直接输出补写内容，不要解释，不要JSON，不要代码块。\n输入：${jsonPayload}`;
    }

    if (task === 'tag-suggest') {
      return `你是校园墙标签助手。基于输入推荐8个中文标签。\n要求：标签短且具体，不带#，每个<=10字。\n仅返回JSON：{"tags":["...","..."]}\n输入：${jsonPayload}`;
    }

    return `仅返回JSON。输入：${jsonPayload}`;
  }

  private ensureStringArray(data: unknown): string[] {
    if (!Array.isArray(data)) return [];
    return data.filter((item) => typeof item === 'string') as string[];
  }

  private trimText(text: string, maxLen: number): string {
    const normalized = String(text ?? '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!normalized) return normalized;
    return normalized.length > maxLen
      ? normalized.slice(0, maxLen)
      : normalized;
  }

  private async ensureExpandedLength(
    payload: Record<string, any>,
    rewritten: string,
  ): Promise<string> {
    const minChars = 500;
    let merged = rewritten.trim();

    for (let i = 0; i < 2; i++) {
      if (this.visibleLength(merged) >= minChars) break;

      const raw = await this.callModel('rewrite-expand-continue', {
        ...payload,
        current: merged,
        minChars,
      });
      const next = String(raw?.rewritten ?? '').trim();
      if (!next) break;
      merged = `${merged}\n${next}`.trim();
    }

    return merged;
  }

  private async ensureExpandedLengthStream(
    payload: Record<string, any>,
    rewritten: string,
    onChunk: (chunk: string) => void,
  ): Promise<string> {
    const minChars = 500;
    let merged = rewritten.trim();

    for (let i = 0; i < 2; i++) {
      if (this.visibleLength(merged) >= minChars) break;

      const next = await this.callOllamaStream(
        'rewrite-stream-continue',
        this.buildPrompt('rewrite-stream-continue', {
          ...payload,
          current: merged,
          minChars,
        }),
        onChunk,
      );

      if (!next.trim()) break;
      merged = `${merged}\n${next}`.trim();
    }

    return merged;
  }

  private visibleLength(text: string): number {
    return String(text ?? '').replace(/\s+/g, '').length;
  }

  private cleanModelOutput(raw: string): string {
    return String(raw ?? '')
      .replace(/^```(?:json)?/i, '')
      .replace(/```$/i, '')
      .trim();
  }

  private extractListItems(text: string, maxCount: number): string[] {
    const lines = text
      .split('\n')
      .map((line) => line.replace(/^\s*[-*•\d.、)\]]+\s*/, '').trim())
      .filter((line) => line.length > 0);

    return lines.slice(0, maxCount);
  }

  private extractTags(text: string): string[] {
    const fromHash = Array.from(
      text.matchAll(/#?([\u4e00-\u9fa5A-Za-z0-9_]{1,10})/g),
    )
      .map((item) => item[1]?.trim())
      .filter((item): item is string => Boolean(item));

    return Array.from(new Set(fromHash));
  }

  private assertEnabled() {
    if (!this.aiEnabled) {
      throw new ServiceUnavailableException('AI 功能未启用');
    }
  }

  private assertRateLimit(userId: string) {
    const now = Date.now();
    const windowMs = 60 * 1000;
    const limit = 20;
    const current = this.records.get(userId);

    if (!current || now - current.windowStart >= windowMs) {
      this.records.set(userId, {
        windowStart: now,
        count: 1,
      });
      return;
    }

    if (current.count >= limit) {
      throw new HttpException(
        'AI 请求过于频繁，请稍后再试',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count += 1;
    this.records.set(userId, current);
  }
}
