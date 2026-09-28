import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedules } from './entities/schedule.entity';
import { BellControlGateway } from '../bell-control/bell-control.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Schedules])],
  controllers: [SchedulesController],
  providers: [SchedulesService, BellControlGateway],
  exports: [SchedulesService, BellControlGateway],
})
export class SchedulesModule {}
