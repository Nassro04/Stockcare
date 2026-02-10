import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Batch } from './batch.entity';
import { User } from '../../users/entities/user.entity';

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

@Entity({ name: 'stock_movements' })
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['IN', 'OUT', 'ADJUSTMENT'] })
  type: MovementType;

  @Column({ name: 'quantity_change', type: 'int' })
  quantityChange: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Batch, (batch) => batch.movements, { nullable: false })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
