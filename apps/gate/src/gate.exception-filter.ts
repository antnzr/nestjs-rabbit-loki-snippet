import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from './dto';

@Catch()
export class GateExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(GateExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost): void {
    this.logger.error(exception.message);

    const context = host.switchToHttp();
    const res = context.getResponse<Response>();
    const req = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const errMsg = exception?.message || 'INTERNAL_SERVER_ERROR';

    res.status(status).json(this.makeResponse(req, status, errMsg));
  }

  private makeResponse(
    req: Request,
    status: number,
    errMsg: string,
  ): ErrorResponse {
    return {
      status,
      path: req.url,
      error: errMsg,
      timestamp: new Date().toISOString(),
    };
  }
}
