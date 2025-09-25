import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { ENV_Config_Module } from './config/config.module';
import { TypeOrmConfigModule } from './config/typeorm.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    ENV_Config_Module,
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([User]),
    // api模块
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
