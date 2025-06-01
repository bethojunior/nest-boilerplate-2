import { HttpStatus } from '@nestjs/common';
import { randomUUID } from 'crypto';

export class BusinessException extends Error {
  public status: HttpStatus;
  public message: string;
  public statusCode: string;
  public errorCode: string;
  public trackId: string;
  constructor(
    message: string,
    status: HttpStatus,
    statusCode?: string,
    errorCode?: string,
  ) {
    super(message);
    this.message = message;
    this.status = status || HttpStatus.BAD_REQUEST;
    this.statusCode = statusCode || '';
    this.errorCode = errorCode || '';
    this.trackId = randomUUID();
  }
}
