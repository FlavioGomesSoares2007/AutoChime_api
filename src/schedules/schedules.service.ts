import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedules } from './entities/schedule.entity';
import { BellControlGateway } from '../bell-control/bell-control.gateway';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private readonly schedulesRepository: Repository<Schedules>,

    private readonly bellControlGateway: BellControlGateway,
  ) {}

  private async syncSchedulesWithEsp32(schoolId: string) {
    const activeSchedules = await this.schedulesRepository.find({
      where: {
        schoolId,
        isActive: true,
      },
    });

    this.bellControlGateway.syncSchedulesToSchool(schoolId, activeSchedules);
  }

  async create(createScheduleDto: CreateScheduleDto) {
    const { schoolId, dayOfWeek, time, isActive } = createScheduleDto;

    if (!schoolId) {
      throw new BadRequestException('O parâmetro schoolId é obrigatório.');
    }

    const existingSchedule = await this.schedulesRepository.findOne({
      where: {
        schoolId: schoolId,
        dayOfWeek,
        time,
      },
    });

    if (existingSchedule) {
      throw new ConflictException(
        'Já existe um agendamento cadastrado para este dia e horário nesta escola.',
      );
    }

    const newSchedule = this.schedulesRepository.create({
      schoolId: schoolId,
      dayOfWeek,
      time,
      isActive: isActive ?? true,
    });

    const savedSchedule = await this.schedulesRepository.save(newSchedule);

    await this.syncSchedulesWithEsp32(schoolId);

    return savedSchedule;
  }

  async findAllBySchool(schoolId: string) {
    return await this.schedulesRepository.find({
      where: {
        schoolId: schoolId,
      },
    });
  }

  async findOne(id: string, schoolId: string) {
    const schedule = await this.schedulesRepository.findOne({
      where: {
        id,
        schoolId: schoolId,
      },
    });

    if (!schedule) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    return schedule;
  }

  async update(
    id: string,
    schoolId: string,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.findOne(id, schoolId);

    const updated = this.schedulesRepository.merge(schedule, updateScheduleDto);
    const savedSchedule = await this.schedulesRepository.save(updated);

    await this.syncSchedulesWithEsp32(schoolId);

    return savedSchedule;
  }

  async remove(id: string, schoolId: string) {
    const schedule = await this.findOne(id, schoolId);
    const result = await this.schedulesRepository.remove(schedule);

    await this.syncSchedulesWithEsp32(schoolId);

    return result;
  }

  async checkCurrentSchedules(schoolId: string) {
    const now = new Date();

    const localTime = now.toLocaleTimeString('pt-BR', {
      timeZone: 'America/Fortaleza',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const currentDayOfWeek = now.getDay();

    const activeSchedules = await this.schedulesRepository.find({
      where: {
        schoolId: schoolId,
        dayOfWeek: currentDayOfWeek,
        time: localTime,
        isActive: true,
      },
    });

    return {
      shouldRing: activeSchedules.length > 0,
      currentTime: localTime,
      currentDayOfWeek,
      schedules: activeSchedules,
    };
  }
}
