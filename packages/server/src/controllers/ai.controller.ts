import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { ResponseData } from '../common/response';
import { AiService } from '../services/ai.service';
import { AiTitleSuggestDto } from '../dto/ai-title-suggest.dto';
import { AiRewriteDto } from '../dto/ai-rewrite.dto';
import { AiTagSuggestDto } from '../dto/ai-tag-suggest.dto';

@Controller('ai')
@UseGuards(JwtGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('title-suggest')
  async suggestTitle(@Req() req: Request, @Body() dto: AiTitleSuggestDto) {
    const userId = (req.user as any).userId;
    const data = await this.aiService.titleSuggest(userId, dto);
    return ResponseData.success(data, '标题建议生成成功');
  }

  @Post('rewrite')
  async rewrite(@Req() req: Request, @Body() dto: AiRewriteDto) {
    const userId = (req.user as any).userId;
    const data = await this.aiService.rewrite(userId, dto);
    return ResponseData.success(data, '正文润色成功');
  }

  @Post('rewrite-stream')
  async rewriteStream(
    @Req() req: Request,
    @Body() dto: AiRewriteDto,
    @Res() res: Response,
  ) {
    const userId = (req.user as any).userId;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await this.aiService.rewriteStream(userId, dto, (chunk) => {
        res.write(chunk);
      });
      res.end();
    } catch (error) {
      if (!res.headersSent) {
        res.status(502).json({
          code: 502,
          message: error?.message ?? '流式润色失败',
          data: null,
        });
      } else {
        res.end();
      }
    }
  }

  @Post('tag-suggest')
  async suggestTag(@Req() req: Request, @Body() dto: AiTagSuggestDto) {
    const userId = (req.user as any).userId;
    const data = await this.aiService.tagSuggest(userId, dto);
    return ResponseData.success(data, '标签建议生成成功');
  }
}
