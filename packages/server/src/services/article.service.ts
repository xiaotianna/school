import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';
import { CreateArticleDto } from '../dto/create-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 保存草稿
   * @param userId 用户ID
   * @param createArticleDto 文章数据
   * @returns 保存的草稿
   */
  async saveDraft(userId: string, createArticleDto: CreateArticleDto) {
    // 查找用户
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 创建文章对象
    const article = new Article();
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;
    article.images = createArticleDto.images || [];
    article.tags = createArticleDto.tags || [];
    article.status = 0; // 草稿状态
    article.author = user;

    // 保存文章
    return await this.articleRepository.save(article);
  }

  /**
   * 发布文章
   * @param userId 用户ID
   * @param createArticleDto 文章数据
   * @returns 发布的文章
   */
  async publishArticle(userId: string, createArticleDto: CreateArticleDto) {
    // 查找用户
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 创建文章对象
    const article = new Article();
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;
    article.images = createArticleDto.images || [];
    article.tags = createArticleDto.tags || [];
    article.status = 1; // 发布状态
    article.author = user;

    // 保存文章
    return await this.articleRepository.save(article);
  }
}
