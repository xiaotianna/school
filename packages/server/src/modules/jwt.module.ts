import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule, JwtService } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../common/constant/env';

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>(JWT_SECRET),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            JWT_EXPIRES_IN,
          ) as StringValue,
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
