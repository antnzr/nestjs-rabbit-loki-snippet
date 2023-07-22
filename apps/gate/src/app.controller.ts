import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponse, ErrorResponse } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Task')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get greeting' })
  @ApiResponse({ status: 200, type: BaseResponse })
  @ApiResponse({ status: 400, type: ErrorResponse })
  async greeting(): Promise<BaseResponse> {
    const greet = await this.appService.greeting();
    return { message: greet };
  }
}
