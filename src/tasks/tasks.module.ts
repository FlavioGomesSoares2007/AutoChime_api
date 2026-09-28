import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { User } from '../users/entities/user.entity'; 
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]), 
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}