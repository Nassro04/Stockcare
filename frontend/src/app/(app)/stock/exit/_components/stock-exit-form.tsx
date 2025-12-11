"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Product } from '@/types/product';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
    productId: z.string().min(1, "Veuillez sélectionner un produit"),
    quantity: z.coerce.number().min(1, "La quantité doit être supérieure à 0"),
    reason: z.string().optional(),
});

export function StockExitForm() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productId: "",
            quantity: 1,
            reason: "Dispensation patient",
        },
    });

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setError("Impossible de charger les produits.");
            }
        }
        fetchProducts();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.post('/stock/dispatch', {
                ...values,
                productId: parseInt(values.productId),
            });
            setSuccess(true);
            form.reset();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error('Stock dispatch failed detailed:', err.response?.data);
            let message = err.response?.data?.message || err.message || 'Une erreur est survenue';

            if (Array.isArray(message)) {
                message = message.join(', ');
            }

            if (message === 'No stock available for this product.') {
                message = 'Stock insuffisant pour ce produit (Quantité: 0). Veuillez faire une entrée de stock d\'abord.';
            } else if (message.includes('Not enough stock')) {
                message = 'Stock insuffisant pour la quantité demandée.';
            }

            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Mode FEFO Actif</AlertTitle>
                    <AlertDescription>
                        Le système sélectionnera automatiquement les lots qui périment le plus tôt (First Expired, First Out).
                    </AlertDescription>
                </Alert>

                <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Produit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un produit" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id.toString()}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantité à sortir</FormLabel>
                            <FormControl>
                                <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Motif</FormLabel>
                            <FormControl>
                                <Input placeholder="Dispensation patient" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="bg-green-50 text-green-900 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle>Succès</AlertTitle>
                        <AlertDescription>Sortie de stock enregistrée avec succès !</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Traitement...' : 'Valider la sortie'}
                </Button>
            </form>
        </Form>
    );
}
