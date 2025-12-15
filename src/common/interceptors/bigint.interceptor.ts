import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class BigintInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next
      .handle()
      .pipe(
        map(
          (data: T) =>
            JSON.parse(
              JSON.stringify(data, (_key: string, value: unknown) =>
                typeof value === 'bigint' ? value.toString() : value,
              ),
            ) as T,
        ),
      );
  }
}
