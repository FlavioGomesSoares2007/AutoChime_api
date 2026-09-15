import { Module } from '@nestjs/common';
import { BellControlGateway } from './bell-control.gateway';
import { BellControlController } from './bell-control.controller';

@Module({
  controllers: [BellControlController],
  providers: [BellControlGateway],
  exports: [BellControlGateway], 
})
export class BellControlModule {}