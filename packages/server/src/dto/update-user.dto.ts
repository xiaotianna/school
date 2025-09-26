import {
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
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
