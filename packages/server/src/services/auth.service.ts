import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const user = await this.usersRepository.findOne({
      where: { phone: dto.phone },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('用户名或密码错误', HttpStatus.BAD_REQUEST);
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

  async signup(dto: SigninDto) {
    // 检查用户是否已存在
    const existingUser = await this.usersRepository.findOne({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      phone: dto.phone,
      password: hashedPassword,
    });
    await this.usersRepository.save(user);

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
