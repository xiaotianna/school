import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { JwtModule } from '../modules/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
