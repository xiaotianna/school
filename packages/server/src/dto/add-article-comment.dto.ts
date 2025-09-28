import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddArticleCommentDto {
  @IsNotEmpty()
  @IsString()
  // 评论内容
  content: string;

  @IsNotEmpty()
  @IsString()
  // 文章id
  articleId: string;

  @IsOptional()
  @IsString()
  // 回复的评论id
  replyCommentId?: string;
}
