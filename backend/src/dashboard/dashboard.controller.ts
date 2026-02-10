import { Controller, Get, UseGuards, Res, Query, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('alerts')
  getAlerts() {
    return this.dashboardService.getAlerts();
  }

  @Get('recent-activity')
  getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }

  @Get('consumption')
  async getConsumption(@Query('productId', new ParseIntPipe({ optional: true })) productId?: number) {
    return this.dashboardService.getDailyConsumption(productId);
  }

  @Get('export-consumption')
  async exportConsumption(@Res() res) {
    const data = await this.dashboardService.getDailyConsumption();

    let csv = 'Date,Consommation\n';
    data.forEach((row: any) => {
      csv += `${row.date},${row.totalConsumption}\n`;
    });

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition':
        'attachment; filename="consommation_journaliere.csv"',
    });

    return res.send(csv);
  }

  @Get('export-stock')
  async exportStock(@Res() res) {
    const batches = await this.dashboardService.getAvailableStockReport();

    let csv = 'Produit,Lot,Quantite,Unite,Expiration,Prix\n';
    batches.forEach((batch) => {
      const productName = batch.product.name.replace(/,/g, ''); // Avoid CSV breakage
      const unit = 'pcs';
      const price = batch.product.price || 0;
      csv += `${productName},${batch.batchNumber},${batch.quantity},${unit},${batch.expirationDate},${price}\n`;
    });

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition':
        'attachment; filename="stock_disponible.csv"',
    });

    return res.send(csv);
  }
}
