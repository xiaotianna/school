import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AiRewriteDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  title?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;

  @IsIn(['polish', 'shorten', 'expand'])
  goal: 'polish' | 'shorten' | 'expand';

  @IsOptional()
  @IsIn(['normal', 'friendly', 'serious'])
  tone?: 'normal' | 'friendly' | 'serious';
}
