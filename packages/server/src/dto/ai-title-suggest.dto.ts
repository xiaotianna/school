import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class AiTitleSuggestDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  draftTitle?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsIn(['normal', 'formal', 'casual'])
  style?: 'normal' | 'formal' | 'casual';
}
