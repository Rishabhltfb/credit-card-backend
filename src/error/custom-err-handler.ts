import { HttpException, HttpStatus } from '@nestjs/common';
import { map } from 'rxjs';
import { CustomError } from './error.interface';

export const handleError = (val) => {
  const { response } = val;
  let { status } = val;
  if (status === 'error') {
    status = 500;
  }
  if (response) {
    const { message, errorStatus } = val.response;
    throw new HttpException({ errorStatus, message }, status);
  } else {
    const { message, errorStatus } = val;
    throw new HttpException({ message, errorStatus }, status);
  }
};

export function throwIfError(res) {
  if (res && res['_isError']) {
    throw new HttpException(
      { message: res['message'], errorStatus: res['errorStatus'] },
      HttpStatus.BAD_REQUEST,
    );
  }
  return res;
}

export function customErrorHandler<TInput>() {
  return map<TInput, TInput>(throwIfError);
}

export function returnCustomErrorIfError(res) {
  if (res && res['_isError']) {
    return new CustomError(res['errorStatus'], res['message']);
  }
  return res;
}

export function identifyAndCastCustomError<TInput>() {
  return map<TInput, TInput>(returnCustomErrorIfError);
}
