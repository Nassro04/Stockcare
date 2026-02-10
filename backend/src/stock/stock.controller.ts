import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { StockService } from './stock.service';
import { AddStockDto } from './dto/add-stock.dto';
import { DispatchStockDto } from './dto/dispatch-stock.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) { }

  @Roles(UserRole.MAGASINIER, UserRole.ADMIN, UserRole.ADMIN_IT)
  @Post('add')
  addStock(@Body() addStockDto: AddStockDto, @Request() req) {
    return this.stockService.addStock(addStockDto, req.user);
  }

  @Roles(UserRole.MAGASINIER, UserRole.ADMIN, UserRole.ADMIN_IT)
  @Post('dispatch')
  dispatchStock(@Body() dispatchStockDto: DispatchStockDto, @Request() req) {
    return this.stockService.dispatchStock(dispatchStockDto, req.user);
  }

  @Get('locations')
  getLocations() {
    return this.stockService.getLocations();
  }

  @Get('history/:productId')
  getProductStockHistory(@Param('productId', ParseIntPipe) productId: number) {
    return this.stockService.getProductStockHistory(productId);
  }

  @Get('location/:locationId')
  getStockByLocation(@Param('locationId', ParseIntPipe) locationId: number) {
    return this.stockService.getStockByLocation(locationId);
  }

  @Get(':productId')
  getProductStock(@Param('productId', ParseIntPipe) productId: number) {
    return this.stockService.getProductStock(productId);
  }
}
