import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    name: 'contact_person',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  contactPerson: string;

  @Column({
    name: 'contact_email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  contactEmail: string;

  @Column({
    name: 'contact_phone',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  contactPhone: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];
}
