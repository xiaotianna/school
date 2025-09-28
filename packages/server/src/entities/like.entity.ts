import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity()
@Unique(['user', 'article']) // 确保同一个用户不能对同一篇文章重复点赞
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Article, { onDelete: 'CASCADE' })
  article: Article;

  @CreateDateColumn()
  create_time: Date;
}
