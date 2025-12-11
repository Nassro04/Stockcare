import { Controller, Post, Get } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('setup')
export class SetupController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post('init')
  async initializeAdmin() {
    try {
      // Check if admin already exists
      const adminExists = await this.usersService.findOneByUsername('admin');

      if (adminExists) {
        return { message: 'Admin user already exists' };
      }

      // Admin doesn't exist, create it
      // Note: role passed as string, handled by DTO/Service
      const admin = await this.usersService.create({
        username: 'admin',
        email: 'admin@stockcare.com',
        password: 'admin',
        role: 'ADMIN_IT', // Use correct enum string
      });

      return {
        message: 'Admin user created successfully',
        username: admin.username,
        email: admin.email,
        role: admin.role
      };
    } catch (error: any) {
      return {
        message: 'Error creating admin user',
        error: error.message,
      };
    }
  }

  @Get('status')
  async checkStatus() {
    try {
      const admin = await this.usersService.findOneByUsername('admin');
      if (admin) {
        return {
          message: 'Admin user exists',
          username: admin.username,
          email: admin.email,
        };
      }
      return {
        message: 'Admin user not found',
      };
    } catch (error: any) {
      return {
        message: 'Admin user does not exist',
        error: error.message,
      };
    }
  }
}
