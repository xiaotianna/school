import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Article } from '../entities/article.entity';
import { Comment } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // 先查找用户
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    // 直接将传入的数据合并到用户对象中
    Object.assign(user, updateUserDto);

    // 保存更新后的用户信息
    return await this.userRepository.save(user);
  }

  // 获取用户及其最近的文章
  async getUserProfileWithRecentArticles(
    userId: string,
  ): Promise<{ user: any; articles: any[] }> {
    // 获取用户信息
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'imgUrl', 'sign', 'tag', 'sex', 'isAnonymous'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 获取用户的文章总数
    const articleCount = await this.articleRepository.count({
      where: {
        author: { id: userId },
        status: 1, // 只统计已发布的文章
      },
    });

    // 获取用户的评论总数
    const commentCount = await this.commentRepository.count({
      where: {
        user: { id: userId },
      },
    });

    // 获取用户获得的点赞总数
    const likeCount = await this.likeRepository
      .createQueryBuilder('like')
      .leftJoin('like.article', 'article')
      .where('article.author.id = :userId', { userId })
      .getCount();

    // 将统计信息添加到用户对象中
    const userWithStats = {
      ...user,
      articleCount,
      commentCount,
      likeCount,
    };

    // 获取用户最近的5篇文章
    let articles: any[] = await this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .where('article.author.id = :userId', { userId })
      .andWhere('article.status = 1') // 只获取已发布的文章
      .orderBy('article.create_time', 'DESC')
      .limit(5)
      .getMany();

    // 为每篇文章获取评论数量
    articles = await Promise.all(
      articles.map(async (article) => {
        const commentCount = await this.commentRepository.count({
          where: {
            article: { id: article.id },
          },
        });
        return {
          ...article,
          commentCount,
        };
      }),
    );

    return { user: userWithStats, articles };
  }
}
