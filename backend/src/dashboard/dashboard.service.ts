import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Batch } from '../stock/entities/batch.entity';
import { StockMovement } from '../stock/entities/stock-movement.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
  ) { }

  async getStats() {
    const totalProducts = await this.productRepository.count();

    const batches = await this.batchRepository.find({
      relations: ['product'],
    });
    const totalStockValue = batches.reduce((acc, batch) => {
      const price = batch.product.price ? Number(batch.product.price) : 0;
      return acc + batch.quantity * price;
    }, 0);

    // Low stock: items with quantity < minThreshold of their product
    const lowStockCount = batches.filter(
      (batch) => batch.quantity < (batch.product.minThreshold || 10),
    ).length;

    // Expiring soon: within 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const expiringCount = batches.filter((batch) => {
      const expiry = new Date(batch.expirationDate);
      return expiry > now && expiry <= thirtyDaysFromNow;
    }).length;

    return {
      totalProducts,
      totalStockItems: batches.reduce((acc, batch) => acc + batch.quantity, 0), // Total physical units
      totalStockValue,
      lowStockCount,
      expiringCount,
    };
  }

  async getAlerts() {
    const batches = await this.batchRepository.find({
      relations: ['product'],
    });

    const lowStock = batches.filter(
      (batch) => batch.quantity < (batch.product.minThreshold || 10),
    );

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const expiringSoon = batches.filter((batch) => {
      const expiry = new Date(batch.expirationDate);
      return expiry > now && expiry <= thirtyDaysFromNow;
    });

    return {
      lowStock,
      expiringSoon,
    };
  }

  async getRecentActivity() {
    // Note: relation 'stockItem' in movement is now 'batch'
    return this.stockMovementRepository.find({
      relations: ['batch', 'batch.product', 'user'],
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async getDailyConsumption(productId?: number) {
    // Postgres compatible date format
    const query = this.stockMovementRepository
      .createQueryBuilder('movement')
      .leftJoin('movement.batch', 'batch') // Join batch to access product
      .leftJoin('batch.product', 'product') // Join product to access id
      .select("TO_CHAR(movement.createdAt, 'YYYY-MM-DD')", 'date')
      .addSelect('SUM(ABS(movement.quantityChange))', 'totalConsumption')
      .where('movement.type = :type', { type: 'OUT' });

    if (productId) {
      query.andWhere('product.id = :productId', { productId });
    }

    const result = await query
      .groupBy("TO_CHAR(movement.createdAt, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC')
      .limit(30) // Show last 30 days
      .getRawMany();

    return result;
  }

  async getAvailableStockReport() {
    return this.batchRepository.find({
      relations: ['product'],
      order: {
        product: { name: 'ASC' },
      },
    });
  }
}
