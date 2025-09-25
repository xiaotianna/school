import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from 'src/dto/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject('JWT') private readonly jwtAccess: JwtService,
  ) {}

  async signin(dto: SigninDto) {
    // 查找是否存在该手机号的用户
    let user = await this.usersRepository.findOne({
      where: { phone: dto.phone },
    });

    if (user) {
      // 用户存在，验证密码
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new Error('密码错误');
      }
    } else {
      // 用户不存在，进行注册
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user = this.usersRepository.create({
        phone: dto.phone,
        password: hashedPassword,
      });
      await this.usersRepository.save(user);
    }

    const token = await this.jwtAccess.signAsync({
      userId: user.id,
      phone: user.phone,
    });

    const info = {
      token,
      ...user,
    };
    return info;
  }
}
