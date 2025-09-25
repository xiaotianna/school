import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule, JwtService } from '@nestjs/jwt';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../common/constant/env';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(JWT_EXPIRES_IN),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'JWT',
      useExisting: JwtService,
    },
  ],
  exports: [NestJwtModule, 'JWT'],
})
export class JwtModule {}
