import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import {User} from '../Domain/Entities/User.entity';
@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService], // Exportamos el servicio para que el AuthModule pueda usarlo
})
export class UsersModule {}