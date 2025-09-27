import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { GetArticlesDto } from '../dto/get-articles.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveArticle(
    userId: string,
    createArticleDto: CreateArticleDto,
    status: 0 | 1,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const article = new Article();
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;
    article.images = createArticleDto.images || [];
    article.tags = createArticleDto.tags || [];
    article.status = status; // 状态 0:草稿 1:发布
    article.author = user;

    return await this.articleRepository.save(article);
  }

  // 更新文章或草稿
  async updateArticle(
    userId: string,
    articleId: string,
    updateArticleDto: UpdateArticleDto,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const article = await this.articleRepository.findOne({
      where: { id: articleId, author: { id: userId } },
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 只更新传入的字段
    if (updateArticleDto.title !== undefined) {
      article.title = updateArticleDto.title;
    }
    if (updateArticleDto.content !== undefined) {
      article.content = updateArticleDto.content;
    }
    if (updateArticleDto.images !== undefined) {
      article.images = updateArticleDto.images;
    }
    if (updateArticleDto.tags !== undefined) {
      article.tags = updateArticleDto.tags;
    }
    if (updateArticleDto.status !== undefined) {
      article.status = updateArticleDto.status;
    }

    return await this.articleRepository.save(article);
  }

  // 获取所有已发布的文章
  async findAllPublished() {
    return await this.articleRepository.find({
      where: { status: 1 }, // 只获取已发布的文章
      relations: ['author'], // 关联作者信息
      select: {
        author: {
          id: true,
          username: true,
          imgUrl: true,
        },
      },
      order: {
        create_time: 'DESC', // 按创建时间倒序排列
      },
    });
  }

  // 获取自己的文章
  async findMyArticles(userId: string, dto: GetArticlesDto) {
    const { page = 1, limit = 10, state, keyword } = dto;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    // 添加用户过滤条件
    queryBuilder.where('article.author.id = :userId', { userId });

    // 添加状态过滤条件
    if (state !== undefined) {
      queryBuilder.andWhere('article.status = :state', { state });
    }

    // 添加关键词搜索条件
    if (keyword) {
      queryBuilder.andWhere(
        'article.title LIKE :keyword OR article.content LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    // 添加关联作者信息
    queryBuilder
      .leftJoinAndSelect('article.author', 'author')
      .select([
        'article.id',
        'article.title',
        'article.content',
        'article.images',
        'article.tags',
        'article.status',
        'article.create_time',
        'article.update_time',
        'article.likes',
        'author.id',
        'author.username',
        'author.imgUrl',
      ]);

    // 添加排序
    queryBuilder.orderBy('article.update_time', 'DESC');

    // 添加分页
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // 删除文章
  async deleteArticle(userId: string, articleId: string) {
    try {
      const result = await this.articleRepository.delete({
        id: articleId,
        author: { id: userId },
      });
      return { affected: result.affected };
    } catch (error) {
      throw new NotFoundException('文章不存在');
    }
  }

  // 获取文章详情
  async getArticleDetail(userId: string, articleId: string) {
    return await this.articleRepository.findOne({
      where: { id: articleId, author: { id: userId } },
      relations: ['author', 'comments'],
      select: {
        author: {
          id: true,
          username: true,
          imgUrl: true,
        },
      },
    });
  }
}
