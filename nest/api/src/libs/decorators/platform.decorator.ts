import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type PlatformType = 'ios' | 'android' | 'web' | 'unknown';

export const Platform = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PlatformType => {
    const request = ctx.switchToHttp().getRequest();
    const userAgent = (request.headers['user-agent'] || '').toLowerCase();

    if (
      userAgent.includes('iphone') ||
      userAgent.includes('ipad') ||
      userAgent.includes('mac')
    ) {
      return 'ios';
    }

    if (userAgent.includes('android')) {
      return 'android';
    }

    if (
      userAgent.includes('windows') ||
      userAgent.includes('linux') ||
      userAgent.includes('x11')
    ) {
      return 'web';
    }

    return 'unknown';
  },
);
