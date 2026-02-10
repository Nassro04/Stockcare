import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThan } from 'typeorm';
import { Batch } from './entities/batch.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Location } from './entities/location.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { AddStockDto } from './dto/add-stock.dto';
import { DispatchStockDto } from './dto/dispatch-stock.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
  ) { }

  async addStock(addStockDto: AddStockDto, user: User) {
    const { productId, batchNumber, quantity, expirationDate, locationId, reason } =
      addStockDto;

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found`);
    }

    let location: Location | null = null;
    if (locationId) {
      location = await this.locationRepository.findOne({
        where: { id: locationId },
      });
      if (!location) {
        throw new NotFoundException(
          `Location with ID "${locationId}" not found`,
        );
      }
    }

    return this.dataSource.transaction(async (manager) => {
      let batch = await manager.findOne(Batch, {
        where: { product: { id: productId }, batchNumber },
      });

      const oldQuantity = batch ? batch.quantity : 0;

      if (batch) {
        batch.quantity += quantity;
      } else {
        batch = manager.create(Batch, {
          product: product,
          batchNumber,
          quantity,
          expirationDate: new Date(expirationDate),
          location: location || undefined,
        });
      }

      const savedBatch = await manager.save(batch);

      const movement = manager.create(StockMovement, {
        batch: savedBatch,
        user,
        type: 'IN',
        quantityChange: quantity,
        reason: reason || 'Réception fournisseur',
      });

      await manager.save(movement);

      await this.auditService.log(user, 'STOCK_ENTRY', `Batch ${batchNumber}`, {
        oldValue: { quantity: oldQuantity },
        newValue: { quantity: savedBatch.quantity },
      });

      return savedBatch;
    });
  }

  async dispatchStock(dispatchStockDto: DispatchStockDto, user: User) {
    const { productId, quantity, reason } = dispatchStockDto;

    // FEFO Logic: Sort by Expiration Date ASC
    const batches = await this.batchRepository.find({
      where: { product: { id: productId }, quantity: MoreThan(0) },
      order: { expirationDate: 'ASC' },
    });

    if (!batches.length) {
      throw new BadRequestException('No stock available for this product.');
    }

    let quantityToDispatch = quantity;
    const dispatchedBatchesLog: any[] = [];

    return this.dataSource.transaction(async (manager) => {
      for (const batch of batches) {
        if (quantityToDispatch <= 0) break;

        const dispatchAmount = Math.min(batch.quantity, quantityToDispatch);
        const oldQuantity = batch.quantity;

        batch.quantity -= dispatchAmount;
        quantityToDispatch -= dispatchAmount;

        await manager.save(batch);

        const movement = manager.create(StockMovement, {
          batch: batch,
          user,
          type: 'OUT',
          quantityChange: -dispatchAmount,
          reason: reason || 'Dispensation patient (FEFO)',
        });

        await manager.save(movement);

        dispatchedBatchesLog.push({
          batchNumber: batch.batchNumber,
          deducted: dispatchAmount,
          remaining: batch.quantity
        });
      }

      if (quantityToDispatch > 0) {
        throw new BadRequestException(
          `Not enough stock. Could only dispatch ${quantity - quantityToDispatch} units.`,
        );
      }

      await this.auditService.log(user, 'STOCK_DISPATCH', `Product ${productId}`, {
        newValue: { dispatched: dispatchedBatchesLog }
      });

      return { message: 'Stock dispatched successfully following FEFO rules.', details: dispatchedBatchesLog };
    });
  }

  async getProductStock(productId: number) {
    return this.batchRepository.find({
      where: { product: { id: productId } },
      relations: ['location'],
      order: { expirationDate: 'ASC' },
    });
  }

  async getStockByLocation(locationId: number) {
    return this.batchRepository.find({
      where: { location: { id: locationId } },
      relations: ['product', 'location'],
      order: { product: { name: 'ASC' }, expirationDate: 'ASC' },
    });
  }

  async getLocations() {
    return this.locationRepository
      .createQueryBuilder('location')
      .loadRelationCountAndMap('location.batchCount', 'location.batches')
      .orderBy('location.name', 'ASC')
      .getMany();
  }

  async getProductStockHistory(productId: number) {
    return this.stockMovementRepository.find({
      where: { batch: { product: { id: productId } } },
      relations: ['batch', 'user'],
      order: { createdAt: 'DESC' },
    });
  }
}
