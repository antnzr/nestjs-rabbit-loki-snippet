import { Inject, Injectable } from '@nestjs/common';
import { TASK_QUEUE } from '../../../libs/common/src/constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject(TASK_QUEUE) private readonly taskService: ClientProxy) {}

  getHello(): string {
    return 'Hello World!';
  }
}
