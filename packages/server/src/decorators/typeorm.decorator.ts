import { UseFilters } from '@nestjs/common';
import { TypeormFilter } from '../filters/typeorm.filter';

// 创建自定义装饰器：统一处理 TypeORM 相关的异常
export function TypeOrmDecorator() {
  return UseFilters(new TypeormFilter());
}
