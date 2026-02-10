import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Batch } from './batch.entity';

@Entity({ name: 'locations' })
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Batch, (batch) => batch.location)
  batches: Batch[];
}
