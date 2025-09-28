import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'user_id',
  })
  id: string;

  @Column({
    unique: true,
    nullable: false,
  })
  phone: string;

  @Column({
    length: 30,
  })
  username: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    default: '/user.png',
  })
  imgUrl: string;

  @Column({
    // 0 保密 1 男 2 女
    default: 0,
  })
  sex: number;

  @Column({
    default: '保持热爱，奔赴山海',
  })
  sign: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  tag: string[];

  @CreateDateColumn()
  create_time: Date;

  // 文章
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  // 评论
  @OneToMany(() => Comment, (comment) => comment.id)
  comments: Comment[];

  // 点赞记录
  @OneToMany(() => Like, (like) => like.user)
  user_likes: Like[];

  // 是否匿名
  @Column({
    default: false,
  })
  isAnonymous: boolean;

  @BeforeInsert()
  setDefaultUsername() {
    this.username = this.phone;
  }

  @BeforeInsert()
  setDefaultValue() {
    if (!this.tag) {
      this.tag = [];
    }
  }
}
