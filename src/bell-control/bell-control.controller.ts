import { Controller, Post, Body } from '@nestjs/common';
import { BellControlGateway } from './bell-control.gateway';
import { BellControlDto } from './dto/bell-control.dto';

@Controller('bell-control')
export class BellControlController {
  constructor(private readonly bellGateway: BellControlGateway) {}

  @Post('trigger')
  triggerBell(@Body() dto: BellControlDto) {
    const roomName = `school_${dto.schoolId}`;

    this.bellGateway.server.to(roomName).emit('bell-control', dto.payload);

    return { success: true };
  }
}
