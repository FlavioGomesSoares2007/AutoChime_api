import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class BellControlDto {
  @IsUUID('4', {
    message:
      'O schoolId deve ser um UUID v4 válido (ex: 550e8400-e29b-41d4-a716-446655440000).',
  })
  @IsNotEmpty({
    message: 'O schoolId da escola é obrigatório.',
  })
  schoolId: string;

  @IsBoolean({
    message: 'O payload deve ser um valor booleano (true ou false).',
  })
  @IsNotEmpty({
    message: 'O payload é obrigatório.',
  })
  payload: boolean;
}
