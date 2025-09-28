import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Req,
  UseGuards,
  Get,
  Request as NextRequest,
  Query,
  Delete,
  HttpException,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { FileTypeDecorator } from 'src/decorators/file-type.decorator';
import { ArticleService } from '../services/article.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { ResponseData } from '../common/response';
import type { Request } from 'express';
import { GetArticlesDto } from '../dto/get-articles.dto';
import { AddArticleCommentDto } from '../dto/add-article-comment.dto';

@Controller('article')
@UseGuards(JwtGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 搜索接口 - 搜索用户和文章
   * @param keyword 搜索关键词
   */
  @Get('search')
  async search(@Query('keyword') keyword: string) {
    try {
      const results = await this.articleService.search(keyword);
      return ResponseData.success(results, '搜索成功');
    } catch (error) {
      return ResponseData.error(500, '搜索失败: ' + error.message);
    }
  }

  /**
   * 获取所有已发布的文章
   * @returns 文章列表
   */
  @Get('all')
  async findAllPublished() {
    try {
      const articles = await this.articleService.findAllPublished();
      return ResponseData.success(articles, '获取文章列表成功');
    } catch (error) {
      return ResponseData.error(500, '获取文章列表失败: ' + error.message);
    }
  }

  /**
   * 获取当前用户的文章列表（支持分页和搜索）
   * @param userId 用户ID
   * @param page 页码
   * @param limit 每页数量
   * @param state 文章状态
   * @param keyword 搜索关键词
   */
  @Get('my')
  async findMyArticles(
    @NextRequest() req: Request,
    @Query() dto: GetArticlesDto,
  ) {
    const userId = (req.user as any).userId;
    const res = await this.articleService.findMyArticles(userId, dto);
    return ResponseData.success(res);
  }

  /**
   * 删除文章接口
   * @param userId 用户ID
   * @param articleId 文章ID
   */
  @Delete()
  async deleteArticles(
    @NextRequest() req: Request,
    @Body('articleId') articleId: string,
  ) {
    const userId = (req.user as any).userId;
    const res = await this.articleService.deleteArticle(userId, articleId);
    if (res.affected === 0) {
      throw new HttpException('删除失败', 400);
    } else if (res.affected > 0) {
      return ResponseData.success(res, '删除成功');
    }
  }

  /**
   * 多图片上传接口
   * @param files 文件对象数组
   * @returns
   */
  @Post('upload')
  @FileTypeDecorator()
  @UseInterceptors(FilesInterceptor('files'))
  upload(@UploadedFiles() files: Array<Express.Multer.File>) {
    const urls = files.map((file) => `/${file.filename}`);

    return ResponseData.success(
      {
        urls,
      },
      '上传成功',
    );
  }

  /**
   * 保存草稿接口
   * @param req 请求对象
   * @param createArticleDto 文章数据
   * @returns
   */
  @Post('draft')
  async saveDraft(
    @Req() req: Request,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    try {
      const userId = (req.user as any).userId;
      const draft = await this.articleService.saveArticle(
        userId,
        createArticleDto,
        0,
      );

      return ResponseData.success(draft, '草稿保存成功');
    } catch (error) {
      return ResponseData.error(500, '草稿保存失败: ' + error.message);
    }
  }

  /**
   * 发布文章接口
   * @param req 请求对象
   * @param createArticleDto 文章数据
   * @returns
   */
  @Post('publish')
  async publishArticle(
    @Req() req: Request,
    @Body() createArticleDto: CreateArticleDto,
  ) {
    try {
      const userId = (req.user as any).userId;
      const article = await this.articleService.saveArticle(
        userId,
        createArticleDto,
        1,
      );
      return ResponseData.success(article, '文章发布成功');
    } catch (error) {
      return ResponseData.error(500, '文章发布失败: ' + error.message);
    }
  }

  /**
   * 更新文章接口
   * @param req 请求对象
   * @param articleId 文章ID
   * @param updateArticleDto 更新的文章数据
   * @returns
   */
  @Put('/publish/update/:id')
  async updateArticle(
    @Req() req: Request,
    @Param('id') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    try {
      const userId = (req.user as any).userId;
      const article = await this.articleService.updateArticle(
        userId,
        articleId,
        updateArticleDto,
      );
      return ResponseData.success(article, '文章更新成功');
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseData.error(404, '文章不存在');
      }
      return ResponseData.error(500, '文章更新失败: ' + error.message);
    }
  }

  /**
   * 更新草稿接口
   * @param req 请求对象
   * @param articleId 文章ID
   * @param updateArticleDto 更新的草稿数据
   * @returns
   */
  @Put('draft/update/:id')
  async updateDraft(
    @Req() req: Request,
    @Param('id') articleId: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    try {
      const userId = (req.user as any).userId;
      // 确保状态为草稿
      updateArticleDto.status = 0;
      const article = await this.articleService.updateArticle(
        userId,
        articleId,
        updateArticleDto,
      );
      return ResponseData.success(article, '草稿更新成功');
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ResponseData.error(404, '草稿不存在');
      }
      return ResponseData.error(500, '草稿更新失败: ' + error.message);
    }
  }

  /**
   * 获取文章详情接口
   * @param userId 用户ID
   */
  @Get('details/:id')
  async getArticleDetail(
    @Param('id') articleId: string,
    @NextRequest() req: Request,
  ) {
    const userId = (req.user as any).userId;
    const article = await this.articleService.getArticleDetail(
      userId,
      articleId,
    );
    return ResponseData.success(article, '获取文章详情成功');
  }

  /**
   * 评论接口
   * @param userId 用户ID
   * @param articleId 文章ID
   * @param content 评论内容
   * @param replyCommentId 回复的评论ID（可能为null）
   */
  @Post('comment/:articleId')
  async addArticleComment(
    @Body() dto: AddArticleCommentDto,
    @NextRequest() req: Request,
  ) {
    const userId = (req.user as any).userId;
    const res = await this.articleService.addArticleComment(userId, dto);
    return ResponseData.success(res, '评论成功');
  }

  /**
   * 文章点赞接口
   */
  @Post('like/:articleId')
  async toggleArticleLike(
    @Param('articleId') articleId: string,
    @NextRequest() req: Request,
  ) {
    const userId = (req.user as any).userId;
    const result = await this.articleService.toggleArticleLike(
      userId,
      articleId,
    );
    return ResponseData.success(
      result,
      result.isLiked ? '点赞成功' : '取消点赞成功',
    );
  }

  /**
   * 活跃用户榜接口 - 获取近7天文章点赞总数最多的用户
   */
  @Get('ranking/active-users')
  async getActiveUsersRanking() {
    const ranking = await this.articleService.getActiveUsersRanking();
    return ResponseData.success(ranking, '获取活跃用户榜成功');
  }

  /**
   * 热门动态榜接口 - 获取近3天点赞最多的文章
   */
  @Get('ranking/popular-articles')
  async getPopularArticlesRanking() {
    const ranking = await this.articleService.getPopularArticlesRanking();
    return ResponseData.success(ranking, '获取热门动态榜成功');
  }

  /**
   * 消息评论、点赞信息列表接口
   */
  @Get('messages')
  async getMessages(@NextRequest() req: Request) {
    const userId = (req.user as any).userId;

    // 获取评论消息
    const commentMessages =
      await this.articleService.getCommentMessages(userId);

    // 获取点赞消息
    const likeMessages = await this.articleService.getLikeMessages(userId);

    return ResponseData.success(
      {
        commentMessages,
        likeMessages,
      },
      '获取消息列表成功',
    );
  }
}
