import { StockItem, StockMovement } from "./stock";

export interface DashboardStats {
    totalProducts: number;
    totalStockItems: number;
    totalStockValue: number;
    lowStockCount: number;
    expiringCount: number;
}

export interface DashboardAlerts {
    lowStock: StockItem[];
    expiringSoon: StockItem[];
}
