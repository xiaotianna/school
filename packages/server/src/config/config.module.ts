import { Module } from '@nestjs/common';
// env
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
// joi 参数校验
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [() => dotenv.config({ path: `.env` })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('production', 'development')
          .default('development'),
        DB_TYPE: Joi.string().default('mysql'),
        DB_DATABASE: Joi.string().default('school_wall'),
        DB_HOST: Joi.string().required().default('localhost'),
        DB_PORT: Joi.number().required().default(3306),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        AI_PROVIDER: Joi.string().default('ollama'),
        OLLAMA_BASE_URL: Joi.string().default('http://127.0.0.1:11434'),
        OLLAMA_MODEL: Joi.string().default('qwen3:0.6b'),
        AI_TIMEOUT_MS: Joi.number().default(8000),
        AI_ENABLED: Joi.boolean().default(true),
      }),
    }),
  ],
})
export class ENV_Config_Module {}
