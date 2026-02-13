import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class AiTagSuggestDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  title?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  maxTags?: number;
}
