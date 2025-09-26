import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    // 先查找用户
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    // 直接将传入的数据合并到用户对象中
    Object.assign(user, updateUserDto);

    // 保存更新后的用户信息
    return await this.userRepository.save(user);
  }
}
