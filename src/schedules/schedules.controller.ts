import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  private getSchoolId(req: any): string {
    const schoolId = req.user?.id || req.user?.sub || req.user?.userId;
    if (!schoolId) {
      throw new UnauthorizedException('ID da escola não encontrado no token.');
    }
    return schoolId;
  }

  @Post()
  create(@Request() req: any, @Body() createScheduleDto: CreateScheduleDto) {
    const schoolId = this.getSchoolId(req);
    return this.schedulesService.create({
      ...createScheduleDto,
      schoolId,
    });
  }

  @Get()
  findAll(@Request() req: any) {
    const schoolId = this.getSchoolId(req);
    return this.schedulesService.findAllBySchool(schoolId);
  }

  @Get('check')
  checkTrigger(@Request() req: any) {
    const schoolId = this.getSchoolId(req);
    return this.schedulesService.checkCurrentSchedules(schoolId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const schoolId = this.getSchoolId(req);
    return this.schedulesService.findOne(id, schoolId);
  }

  @Patch(':id')
  update(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const schoolId = this.getSchoolId(req);
    return this.schedulesService.update(id, schoolId, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
    const schoolId = this.getSchoolId(req);
    return this.schedulesService.remove(id, schoolId);
  }
}