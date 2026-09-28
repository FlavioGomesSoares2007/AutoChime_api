import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { BellControlGateway } from './bell-control/bell-control.gateway';
import { BellControlController } from './bell-control/bell-control.controller';
import { BellControlModule } from './bell-control/bell-control.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        
        ssl: {
          rejectUnauthorized: false,
        },
        
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    BellControlModule,
    UsersModule,
    MailModule,
    AuthModule,
    SchedulesModule,
  ],
  controllers: [BellControlController],
  providers: [BellControlGateway],
})
export class AppModule {}