import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { CustomError } from 'src/error/error.interface';

export function CustomErrorInterceptor(): MethodDecorator {
  return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    const logger = new Logger('CustomErrorInterceptor');
    const method = descriptor.value;

    // eslint-disable-next-line func-names
    descriptor.value = async function (this: any, ...args: any[]) {
      let result;
      try {
        result = await method.apply(this, args);
      } catch (e) {
        logger.error(JSON.stringify(e.error ?? {}));
        logger.error(e);

        throw new BadRequestException({
          errorStatus: 'INTERNAL_ERROR',
          message: 'Internal Server Error',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      if (result instanceof CustomError) {
        throw new BadRequestException({
          ...result,
          status: HttpStatus.BAD_REQUEST,
        });
      }
      return result;
    };
    return descriptor;
  };
}
