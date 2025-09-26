import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Body,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FileTypeDecorator } from 'src/decorators/file-type.decorator';
import { ArticleService } from '../services/article.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from '../dto/create-article.dto';
import { Request } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { ResponseData } from '../common/response';

@Controller('article')
@UseGuards(JwtGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
      // 从请求中获取用户ID（假设已经通过JWT验证）
      const userId = (req.user as any).id;
      const draft = await this.articleService.saveDraft(
        userId,
        createArticleDto,
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
      // 从请求中获取用户ID（假设已经通过JWT验证）
      const userId = (req.user as any).id;
      const article = await this.articleService.publishArticle(
        userId,
        createArticleDto,
      );
      return ResponseData.success(article, '文章发布成功');
    } catch (error) {
      return ResponseData.error(500, '文章发布失败: ' + error.message);
    }
  }
}
