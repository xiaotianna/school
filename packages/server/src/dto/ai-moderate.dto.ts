import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AiModerateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content: string;
}
