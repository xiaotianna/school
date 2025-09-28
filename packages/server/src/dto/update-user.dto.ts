import {
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsBoolean,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 20, {
    message: '用户名长度必须在1-20个字符之间',
  })
  username?: string;

  @IsOptional()
  imgUrl?: string;

  @IsOptional()
  @IsEnum([0, 1, 2])
  sex?: number;

  @IsOptional()
  @IsString()
  sign?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tag?: string[];

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
