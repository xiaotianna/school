import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Article } from '../entities/article.entity';
import { Comment } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Article, Comment, Like]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../', '/public/upload/user'),
        filename: (req, file, callback) => {
          const fileName = `${new Date().getTime() + extname(file.originalname)}`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
