import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Batch } from './entities/batch.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Location } from './entities/location.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Batch, StockMovement, Location, Product]),
    ProductsModule,
    AuditModule,
  ],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule { }
