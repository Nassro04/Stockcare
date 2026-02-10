import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';


import { SetupController } from './setup.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, SetupController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }
