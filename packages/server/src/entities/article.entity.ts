import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Article {
  // 文章id
  @PrimaryGeneratedColumn('uuid', {
    name: 'article_id',
  })
  id: string;

  // 标题
  @Column({
    nullable: false,
  })
  title: string;

  // 内容
  @Column({
    nullable: false,
  })
  content: string;

  // 图片
  @Column({
    type: 'json',
    nullable: true,
  })
  images: string[];

  // tag标签
  @Column({
    type: 'json',
    nullable: true,
  })
  tags: string[];

  // 状态 0:草稿 1:发布
  @Column({
    nullable: false,
  })
  status: number;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  // 点赞数
  @Column({
    default: 0,
  })
  likes: number;

  // 作者
  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  // 评论
  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @BeforeInsert()
  setDefaultValue() {
    if (!this.tags) {
      this.tags = [];
    }
    if (!this.images) {
      this.images = [];
    }
  }
}
