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
   * 登录接口
   * @method POST
   * @param phone 手机号
   * @param password 密码
   */
  @Post('signin')
  async signin(@Body() dto: SigninDto) {
    const res = await this.authService.signin(dto);
    const { id, phone, token, username, imgUrl } = res;
    return ResponseData.success({ id, phone, token, username, imgUrl });
  }

  /**
   * 注册接口
   * @method POST
   * @param phone 手机号
   * @param password 密码
   */
  @Post('signup')
  async signup(@Body() dto: SigninDto) {
    const res = await this.authService.signup(dto);
    const { id, phone } = res;
    return ResponseData.success({ id, phone });
  }
}
