import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) { }

  async log(
    user: User,
    actionType: string,
    entityAffected: string,
    changes: { oldValue?: any; newValue?: any; ipAddress?: string } = {},
  ) {
    const log = this.auditLogRepository.create({
      user,
      actionType,
      entityAffected,
      oldValue: changes.oldValue,
      newValue: changes.newValue,
      ipAddress: changes.ipAddress,
    });
    return this.auditLogRepository.save(log);
  }

  async findAll() {
    return this.auditLogRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
