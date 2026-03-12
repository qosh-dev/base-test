import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { BaseTokenPayload } from '../types';

export const CurrentUser = createParamDecorator(
  (data: keyof BaseTokenPayload | undefined, ctx: ExecutionContext): BaseTokenPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as BaseTokenPayload;

    if (!user) {
      throw new Error('CurrentUser decorator used without authentication');
    }

    if (data) {
      return (user as any)[data];
    }

    return user;
  },
);
