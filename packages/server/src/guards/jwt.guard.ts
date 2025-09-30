import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

// jwt校验
@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 检查是否有 @Public() 装饰器
    // reflector 获取元数据信息
    // reflector.getAllAndOverride() 方法用于获取指定元数据标签的值，并返回一个布尔值。
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // 允许公共访问，跳过JWT验证
    }

    // 否则执行正常的JWT验证
    return super.canActivate(context);
  }
}
