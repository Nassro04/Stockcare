import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Location } from './location.entity';
import { StockMovement } from './stock-movement.entity';

@Entity({ name: 'batches' })
export class Batch {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'batch_number', type: 'varchar', length: 100 })
    batchNumber: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ name: 'expiration_date', type: 'date' })
    expirationDate: Date;

    @CreateDateColumn({ name: 'received_at', type: 'timestamp' })
    receivedAt: Date;

    @ManyToOne(() => Product, { nullable: false, eager: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Location, (location) => location.batches, {
        nullable: true,
        eager: true,
    })
    @JoinColumn({ name: 'location_id' })
    location: Location;

    @OneToMany(() => StockMovement, (movement) => movement.batch)
    movements: StockMovement[];
}
