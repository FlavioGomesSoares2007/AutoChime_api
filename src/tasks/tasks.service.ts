import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Interval(3 * 24 * 60 * 60 * 1000)
  async consultarBanco() {

    try {
      const users = await this.userRepository.find();

      this.logger.log(
        `${users.length} usuários encontrados.`,
      );

      console.log(users);
    } catch (error) {
      this.logger.error(
        'Erro ao buscar usuários:',
        error,
      );
    }
  }
}