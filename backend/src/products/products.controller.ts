import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }


  // --- Categories ---

  @Roles(UserRole.PHARMACIEN, UserRole.ADMIN, UserRole.ADMIN_IT)
  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Get('categories')
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Roles(UserRole.PHARMACIEN, UserRole.ADMIN, UserRole.ADMIN_IT)
  @Put('categories/:id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.updateCategory(id, createCategoryDto);
  }

  @Roles(UserRole.PHARMACIEN, UserRole.ADMIN, UserRole.ADMIN_IT)
  @Delete('categories/:id')
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeCategory(id);
  }

  // --- Suppliers ---

  @Roles(UserRole.PHARMACIEN, UserRole.ADMIN, UserRole.ADMIN_IT)
  @Post('suppliers')
  createSupplier(@Body() createSupplierDto: CreateSupplierDto) {
    return this.productsService.createSupplier(createSupplierDto);
  }

  @Get('suppliers')
  findAllSuppliers() {
    return this.productsService.findAllSuppliers();
  }

  @Roles(UserRole.PHARMACIEN, UserRole.ADMIN, UserRole.ADMIN_IT)
  @Put('suppliers/:id')
  updateSupplier(@Param('id', ParseIntPipe) id: number, @Body() createSupplierDto: CreateSupplierDto) {
    return this.productsService.updateSupplier(id, createSupplierDto);
  }

  @Roles(UserRole.PHARMACIEN, UserRole.ADMIN, UserRole.ADMIN_IT)
  @Delete('suppliers/:id')
  removeSupplier(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.removeSupplier(id);
  }

  // --- Products ---

  @Roles(UserRole.PHARMACIEN)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Roles(UserRole.PHARMACIEN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Roles(UserRole.PHARMACIEN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
