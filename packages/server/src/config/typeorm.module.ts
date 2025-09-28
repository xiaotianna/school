import { Module } from '@nestjs/common';
// typeorm
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
// env
import { ConfigModule, ConfigService } from '@nestjs/config';
// 常量
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_TYPE,
  DB_USERNAME,
} from '../common/constant/env';
// typeorm 实体
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { Comment } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(DB_TYPE),
          host: configService.get(DB_HOST),
          port: configService.get(DB_PORT),
          username: configService.get(DB_USERNAME),
          password: configService.get(DB_PASSWORD),
          database: configService.get(DB_DATABASE),
          entities: [User, Article, Comment, Like],
          // synchronize: configService.get(TYPEORM_synchronize), // 初始化时要为true，不然会创建不了表
          synchronize: true, // 初始化时要为true，不然会创建不了表
        }) as TypeOrmModuleOptions,
    }),
  ],
})
export class TypeOrmConfigModule {}
