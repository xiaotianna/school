import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';
import { ResponseData } from '../common/response';

@Controller('user')
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
}
