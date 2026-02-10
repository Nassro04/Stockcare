import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Product } from '../products/entities/product.entity';
import { Batch } from '../stock/entities/batch.entity';
import { StockMovement } from '../stock/entities/stock-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Batch, StockMovement])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
