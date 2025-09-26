import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity()
export class Comment {
  // 评论id
  @PrimaryGeneratedColumn('uuid', {
    name: 'comment_id',
  })
  id: string;

  // 评论内容
  @Column({
    nullable: false,
  })
  content: string;

  // 评论时间
  @CreateDateColumn()
  create_time: Date;

  // 用户id（自己的id）
  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  // 文章id
  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;

  // 回复的评论id（如果没有回复，则为null）
  @ManyToOne(() => Comment, (comment) => comment.id, { nullable: true })
  reply_comment: Comment | null;
}
