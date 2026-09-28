import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  Matches,
  IsUUID,
} from 'class-validator';
import { DayOfWeek } from '../entities/schedule.entity'

export class CreateScheduleDto {
  @IsUUID('4', { message: 'O schoolId deve ser um UUID v4 válido.' })
  @IsOptional()
  schoolId?: string;

  @IsEnum(DayOfWeek, {
    message: 'O dia da semana deve ser um valor válido.',
  })
  @IsNotEmpty({ message: 'O dia da semana é obrigatório.' })
  dayOfWeek: DayOfWeek;

  @IsString({ message: 'O horário deve ser uma string.' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'O horário deve estar no formato HH:mm ou HH:mm:ss.',
  })
  @IsNotEmpty({ message: 'O horário é obrigatório.' })
  time: string;

  @IsBoolean({ message: 'O campo isActive deve ser booleano.' })
  @IsOptional()
  isActive?: boolean;
}