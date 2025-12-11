export interface Product {
    id: number;
    name: string;
    description: string;
    price: number | string;
    minThreshold: number;
    categoryId: number;
    supplierId: number;
    createdAt: string;
    updatedAt: string;
}
