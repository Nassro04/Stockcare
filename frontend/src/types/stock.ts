import { Product } from "./product";

export interface Batch {
    id: number;
    batchNumber: string;
    quantity: number;
    expirationDate: string;
    receivedAt: string;
    product: Product;
    location?: {
        id: number;
        name: string;
    };
}

export interface StockMovement {
    id: number;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantityChange: number;
    reason: string;
    createdAt: string;
    batch: Batch;
    user: {
        id: number;
        username: string;
    };
}

export interface AddStockDto {
    productId: number;
    batchNumber: string;
    quantity: number;
    expirationDate: string;
    locationId?: number;
    reason?: string;
}
