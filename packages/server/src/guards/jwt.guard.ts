import { AuthGuard } from '@nestjs/passport';

// jwt校验
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
