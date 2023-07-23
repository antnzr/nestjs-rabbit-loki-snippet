import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponse, ErrorResponse } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Get greeting' })
  @ApiResponse({ status: 200, type: BaseResponse })
  @ApiResponse({ status: 400, type: ErrorResponse })
  @Get()
  async greeting(): Promise<BaseResponse> {
    const greet = await this.appService.greeting();
    return { message: greet };
  }
}
