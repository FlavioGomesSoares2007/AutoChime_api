import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  @Length(3, 100, { message: 'O nome deve ter entre 3 e 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @MaxLength(150, { message: 'O e-mail deve ter no máximo 150 caracteres' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @MaxLength(50, { message: 'A senha deve ter no máximo 50 caracteres' })
  password: string;
}