import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  barcode: string;

  @Column({ name: 'min_threshold', type: 'int', default: 10 })
  minThreshold: number;

  @Column({ name: 'max_threshold', type: 'int', nullable: true })
  maxThreshold: number;

  @Column({ name: 'datamatrix_code', type: 'varchar', length: 255, nullable: true })
  datamatrixCode: string;

  @Column({ name: 'is_prescription_needed', type: 'boolean', default: false })
  isPrescriptionNeeded: boolean;


  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;
}
