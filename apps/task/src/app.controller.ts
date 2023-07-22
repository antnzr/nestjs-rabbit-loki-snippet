import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { RmqService } from '../../../libs/rmq/src';
import { TASK } from '../../../libs/common/src/constants';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { GreetingDto } from '../../../libs/common/src/dto';

@Controller('task')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern(TASK.GREETING)
  handleGreeting(
    @Ctx() context: RmqContext,
    @Payload() payload: GreetingDto,
  ): string {
    this.rmqService.ack(context);
    return this.appService.handleGreeting(payload);
  }
}
