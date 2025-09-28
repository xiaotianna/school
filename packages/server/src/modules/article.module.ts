import { Module } from '@nestjs/common';
import { ArticleController } from '../controllers/article.controller';
import { ArticleService } from '../services/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Article } from '../entities/article.entity';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';
import { Like } from '../entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Article, Comment, Like]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../', '/public/upload/article'),
        filename: (req, file, callback) => {
          const fileName = `${new Date().getTime() + extname(file.originalname)}`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [TypeOrmModule],
})
export class ArticleModule {}
