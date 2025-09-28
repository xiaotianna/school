import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';
import { CreateArticleDto } from '../dto/create-article.dto';
import { GetArticlesDto } from '../dto/get-articles.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { AddArticleCommentDto } from '../dto/add-article-comment.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
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
          isAnonymous: true,
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
        'author.isAnonymous',
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

  // 文章点赞/取消点赞
  async toggleArticleLike(userId: string, articleId: string) {
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 查找文章
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 检查是否已经点赞
    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        article: { id: articleId },
      },
    });

    if (existingLike) {
      // 取消点赞
      await this.likeRepository.remove(existingLike);
      article.likes -= 1;
    } else {
      // 点赞
      const like = new Like();
      like.user = user;
      like.article = article;
      await this.likeRepository.save(like);
      article.likes += 1;
    }

    // 保存文章
    await this.articleRepository.save(article);

    // 返回最新的点赞数和点赞状态
    return {
      likes: article.likes,
      isLiked: !existingLike, // 返回新的点赞状态
    };
  }

  // 获取文章详情
  async getArticleDetail(userId: string, articleId: string) {
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
      // 关联关系
      relations: [
        'author',
        'comments',
        'comments.user', // 关联评论的用户字段
        'comments.reply_comment', // 评论的回复字段
        'comments.reply_comment.user', // 回复的用户字段
      ],
      order: {
        comments: {
          create_time: 'ASC',
        },
      },
      select: {
        author: {
          id: true,
          username: true,
          imgUrl: true,
          isAnonymous: true,
        },
        comments: {
          id: true,
          content: true,
          create_time: true,
          user: {
            id: true,
            username: true,
            imgUrl: true,
            isAnonymous: true,
          },
          reply_comment: {
            id: true,
            create_time: true,
            user: {
              id: true,
              username: true,
              imgUrl: true,
              isAnonymous: true,
            },
          },
        },
      },
    });

    // 检查当前用户是否点赞了这篇文章
    const existingLike = await this.likeRepository.findOne({
      where: {
        user: { id: userId },
        article: { id: articleId },
      },
    });

    const isLike = !!existingLike;

    return {
      ...article,
      isLike,
    };
  }

  // 新增文章评论
  async addArticleComment(userId: string, dto: AddArticleCommentDto) {
    const { content, articleId, replyCommentId } = dto;

    // 查找用户
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    // 查找文章
    const article = await this.articleRepository.findOne({
      where: { id: articleId },
    });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 查找被回复的评论（如果有的话）
    let replyComment = null;
    if (replyCommentId) {
      replyComment = await this.commentRepository.findOne({
        where: { id: replyCommentId },
        relations: ['article', 'user'],
      });
      if (!replyComment) {
        throw new NotFoundException('被回复的评论不存在');
      }
    }

    // 创建新评论
    const newComment = this.commentRepository.create({
      content,
      user,
      article,
      reply_comment: replyComment,
    });
    const savedComment = await this.commentRepository.save(newComment);
    // 返回的数据
    const comment = await this.commentRepository.findOne({
      where: { id: savedComment.id },
      relations: ['user', 'reply_comment', 'reply_comment.user'],
      select: {
        id: true,
        content: true,
        create_time: true,
        user: {
          id: true,
          username: true,
          imgUrl: true,
          isAnonymous: true,
        },
        reply_comment: {
          id: true,
          create_time: true,
          user: {
            id: true,
            username: true,
            imgUrl: true,
            isAnonymous: true,
          },
        },
      },
    });
    return comment;
  }

  // 活跃用户榜 - 获取近7天文章点赞总数最多的用户
  async getActiveUsersRanking() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const ranking = await this.likeRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.article', 'article')
      .leftJoinAndSelect('article.author', 'author')
      .select([
        'author.id',
        'author.username',
        'author.imgUrl',
        'author.isAnonymous',
        'COUNT(like.id) as likeCount',
      ])
      .where('like.create_time >= :sevenDaysAgo', { sevenDaysAgo })
      .groupBy('author.id, author.username, author.imgUrl, author.isAnonymous')
      .orderBy('likeCount', 'DESC')
      .limit(10)
      .getRawMany();

    // 格式化返回数据
    return ranking.map((item) => ({
      user: {
        id: item.author_user_id,
        username: item.author_username,
        imgUrl: item.author_imgUrl,
        isAnonymous: item.author_isAnonymous,
      },
      likeCount: parseInt(item.likeCount, 10),
    }));
  }

  // 热门动态榜 - 获取近3天点赞最多的文章
  async getPopularArticlesRanking() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const ranking = await this.likeRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.article', 'article')
      .leftJoinAndSelect('article.author', 'author')
      .select([
        'article.id',
        'article.title',
        'article.content',
        'article.images',
        'article.tags',
        'article.create_time',
        'author.id',
        'author.username',
        'author.imgUrl',
        'author.isAnonymous',
        'COUNT(like.id) as likeCount',
      ])
      .where('like.create_time >= :threeDaysAgo', { threeDaysAgo })
      .groupBy(
        'article.id, article.title, article.content, article.images, article.tags, article.create_time, author.id, author.username, author.imgUrl, author.isAnonymous',
      )
      .orderBy('likeCount', 'DESC')
      .limit(10)
      .getRawMany();

    // 格式化返回数据
    return ranking.map((item) => ({
      article: {
        id: item.article_article_id,
        title: item.article_title,
        content: item.article_content,
        images: item.article_images,
        tags: item.article_tags,
        create_time: item.article_create_time,
      },
      author: {
        id: item.author_user_id,
        username: item.author_username,
        imgUrl: item.author_imgUrl,
        isAnonymous: item.author_isAnonymous,
      },
      likeCount: parseInt(item.likeCount, 10),
    }));
  }

  // 获取用户的评论消息列表
  async getCommentMessages(userId: string) {
    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.article', 'article')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'comment.id',
        'comment.content',
        'comment.create_time',
        'user.id',
        'user.username',
        'user.imgUrl',
        'user.isAnonymous',
        'article.id',
        'article.title',
      ])
      .where('article.author.id = :userId', { userId })
      .andWhere('comment.user.id != :userId', { userId }) // 排除自己对自己的评论
      .orderBy('comment.create_time', 'DESC')
      .getMany();

    // 格式化返回数据（扁平化结构）
    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      create_time: comment.create_time,
      user_id: comment.user.id,
      username: comment.user.username,
      user_imgUrl: comment.user.imgUrl,
      user_isAnonymous: comment.user.isAnonymous,
      article_id: comment.article.id,
      article_title: comment.article.title,
    }));
  }

  // 获取用户的点赞消息列表
  async getLikeMessages(userId: string) {
    const likes = await this.likeRepository
      .createQueryBuilder('like')
      .leftJoinAndSelect('like.article', 'article')
      .leftJoinAndSelect('like.user', 'user')
      .select([
        'like.create_time',
        'user.id',
        'user.username',
        'user.imgUrl',
        'user.isAnonymous',
        'article.id',
        'article.title',
      ])
      .where('article.author.id = :userId', { userId })
      .andWhere('like.user.id != :userId', { userId }) // 排除自己对自己的点赞
      .orderBy('like.create_time', 'DESC')
      .getMany();

    // 格式化返回数据（扁平化结构）
    return likes.map((like) => ({
      create_time: like.create_time,
      user_id: like.user.id,
      username: like.user.username,
      user_imgUrl: like.user.imgUrl,
      user_isAnonymous: like.user.isAnonymous,
      article_id: like.article.id,
      article_title: like.article.title,
    }));
  }
}
