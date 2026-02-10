import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findOneByUsername(username: string): Promise<User | undefined> {
    // Role is a column now, no relation needed
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      // Return undefined instead of throwing for AuthGuard sometimes
      return undefined;
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, role, ...userData } = createUserDto;

    // Validate Schema/Enum if needed, but DTO should handle it.
    // Default to MAGASINIER if not specified
    const userRole = (role as UserRole) || UserRole.MAGASINIER;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userRole,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Role update
    if (updateUserDto.role) {
      user.role = updateUserDto.role as UserRole;
      // Don't need to delete from dto since we assign manually or overwrite
    }

    Object.assign(user, { ...updateUserDto, role: user.role });
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
