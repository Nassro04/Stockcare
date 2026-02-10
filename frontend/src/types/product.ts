export interface Product {
  id: number;
  name: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  } | null;
  supplier: {
    id: number;
    name: string;
  } | null;
}
