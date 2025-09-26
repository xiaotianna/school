import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { ResponseData } from '../common/response';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { FileTypeDecorator } from '../decorators/file-type.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

export interface FileObject extends File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseData<User | null>> {
    const user = await this.userService.findOneById(id);
    if (user) {
      delete user.password;
      return ResponseData.success(user);
    }
    return ResponseData.error(404, '用户不存在');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseData<User | null>> {
    try {
      const user = await this.userService.update(id, updateUserDto);
      if (user) {
        delete user.password;
        return ResponseData.success(user);
      }
      return ResponseData.error(404, '用户不存在');
    } catch (error) {
      return ResponseData.error(500, '更新用户信息失败');
    }
  }

  /**
   * 图片上传接口
   * @param file 文件对象
   * @returns
   */
  @Post('upload')
  @FileTypeDecorator()
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: File) {
    return {
      code: 200,
      message: '上传成功',
      data: {
        url: `/${(file as FileObject).filename}`,
      },
    };
  }
}
