import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
