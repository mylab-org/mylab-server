import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserPayLoad {
  userId: number;
}

interface RequestWithUser {
  user: UserPayLoad;
}

export const User = createParamDecorator((data: keyof UserPayLoad, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  const user = request.user;

  if (!user) return null;

  return user[data];
});
