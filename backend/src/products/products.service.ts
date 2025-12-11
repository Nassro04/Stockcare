import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Supplier } from './entities/supplier.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) { }

  // --- Categories ---

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['products'] // Eager load products for listing
    });
  }

  async updateCategory(id: number, createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Category not found');
  }

  // --- Suppliers ---

  async createSupplier(
    createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    const supplier = this.supplierRepository.create(createSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  findAllSuppliers(): Promise<Supplier[]> {
    return this.supplierRepository.find();
  }

  async updateSupplier(id: number, createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (!supplier) throw new NotFoundException('Supplier not found');
    Object.assign(supplier, createSupplierDto);
    return this.supplierRepository.save(supplier);
  }

  async removeSupplier(id: number): Promise<void> {
    const result = await this.supplierRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Supplier not found');
  }

  // --- Products ---

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, supplierId, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID "${categoryId}" not found`,
        );
      }
      product.category = category;
    }

    if (supplierId) {
      const supplier = await this.supplierRepository.findOneBy({
        id: supplierId,
      });
      if (!supplier) {
        throw new NotFoundException(
          `Supplier with ID "${supplierId}" not found`,
        );
      }
      product.supplier = supplier;
    }

    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    const { categoryId, supplierId, ...productData } = updateProductDto;

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID "${categoryId}" not found`,
        );
      }
      product.category = category;
    }

    if (supplierId) {
      const supplier = await this.supplierRepository.findOneBy({
        id: supplierId,
      });
      if (!supplier) {
        throw new NotFoundException(
          `Supplier with ID "${supplierId}" not found`,
        );
      }
      product.supplier = supplier;
    }

    Object.assign(product, productData);

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
  }
}
