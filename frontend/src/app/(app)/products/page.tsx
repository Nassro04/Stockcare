"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Product } from '@/types/product';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { ProductActions } from './_components/product-actions';

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get('/products');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-8">Chargement des produits...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Gestion des Produits</h2>
        <ProductActions />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}

