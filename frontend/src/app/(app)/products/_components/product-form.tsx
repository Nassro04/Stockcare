"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import api from '@/lib/api';
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  description: z.string().optional(),
  sku: z.string().optional(),
  alertThreshold: z.number().int().min(0).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  onSuccess: () => void;
}

export function ProductForm({ initialData, onSuccess }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      sku: initialData.sku || '',
      alertThreshold: initialData.alertThreshold,
    } : {
      name: "",
      description: "",
      sku: "",
      alertThreshold: 10,
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: ProductFormValues) {
    setIsLoading(true);
    try {
      if (initialData) {
        // Logique de mise à jour
        await api.patch(`/products/${initialData.id}`, values);
      } else {
        // Logique de création
        await api.post('/products', values);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save product:', error);
      // TODO: Afficher une notification d'erreur à l'utilisateur
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du produit</FormLabel>
              <FormControl>
                <Input placeholder="Doliprane 1000mg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Boîte de 8 comprimés" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="DOLI1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alertThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seuil d&apos;alerte</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (initialData ? 'Mise à jour...' : 'Création...') : (initialData ? 'Mettre à jour' : 'Créer')}
        </Button>
      </form>
    </Form>
  );
}
