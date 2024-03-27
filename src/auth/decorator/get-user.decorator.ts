import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    //para retornar somente uma informação especifica quando o decorator for chamado com um parâmetro(de nome igual a uma das propriedades do objeto)
    if (data) return request.user[data];

    return request.user;
  },
);
