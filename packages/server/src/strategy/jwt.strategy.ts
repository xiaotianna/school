import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { JWT_SECRET } from '../common/constant/env';

// jwt校验
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    protected configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      // 从请求头中获取token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_SECRET),
    });
  }

  // 对token进行校验，会在req.user上添加信息
  async validate(payload: { userId: string; phone: string }) {
    const user_info = await this.usersRepository.findOne({
      where: { id: payload.userId },
      select: ['id', 'phone'],
    });
    if (!user_info) return false;
    if (user_info.phone !== payload.phone && user_info.id !== payload.userId)
      return false;
    return { userId: payload.userId, phone: payload.phone };
  }
}
