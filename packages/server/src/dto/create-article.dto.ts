import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty({ message: '标题不能为空' })
  @IsString({ message: '标题必须是字符串' })
  title: string;

  @IsNotEmpty({ message: '内容不能为空' })
  @IsString({ message: '内容必须是字符串' })
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum([0, 1])
  status?: number; // 0:草稿 1:发布
}
