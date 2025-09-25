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

  @CreateDateColumn()
  create_time: Date;

  @BeforeInsert()
  setDefaultUsername() {
    this.username = this.phone;
  }
}
