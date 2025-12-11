import { Test, TestingModule } from '@nestjs/testing';
import { StockService } from './stock.service';

import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { StockItem } from './entities/stock-item.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { Location } from './entities/location.entity';
import { Product } from '../products/entities/product.entity';

describe('StockService', () => {
  let service: StockService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        { provide: getRepositoryToken(StockItem), useValue: mockRepository },
        {
          provide: getRepositoryToken(StockMovement),
          useValue: mockRepository,
        },
        { provide: getRepositoryToken(Location), useValue: mockRepository },
        { provide: getRepositoryToken(Product), useValue: mockRepository },
        {
          provide: DataSource,
          useValue: {
            transaction: jest.fn((cb) => cb(mockDataSource)), // Mock transaction to execute callback
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
