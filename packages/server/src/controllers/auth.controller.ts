import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { TypeOrmDecorator } from '../decorators/typeorm.decorator';
import { SigninDto } from '../dto/signin.dto';
import { ResponseData } from '../common/response';

@Controller('auth')
@TypeOrmDecorator()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 登录/注册接口
   * @method POST
   * @param phone 手机号
   * @param password 密码
   */
  @Post('signin')
  async signin(@Body() dto: SigninDto) {
    const res = await this.authService.signin(dto);
    const { id, phone, username } = res;
    return ResponseData.success({ id, phone, username });
  }
}
