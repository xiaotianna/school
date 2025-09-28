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
import { FileObject } from '../types/file';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 用户主页接口 - 获取用户信息和最近文章
   * 必须写在前面（不然会匹配到/:id路由）
   * @param id 用户ID
   */
  @Get('profile/:userId')
  async getUserProfile(@Param('userId') userId: string) {
    const res = await this.userService.getUserProfileWithRecentArticles(userId);
    return ResponseData.success(res);
  }

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
    return ResponseData.success(
      {
        url: `/${(file as FileObject).filename}`,
      },
      '上传成功',
    );
  }
}
