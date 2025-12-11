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
import { CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
    productId: z.string().min(1, "Veuillez sélectionner un produit"),
    batchNumber: z.string().min(1, "Le numéro de lot est requis"),
    quantity: z.coerce.number().min(1, "La quantité doit être supérieure à 0"),
    expirationDate: z.string().min(1, "La date d'expiration est requise"),
    locationId: z.string().optional(),
    reason: z.string().optional(),
});

export function StockEntryForm() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productId: "",
            batchNumber: "",
            quantity: 1,
            expirationDate: "",
            locationId: "",
            reason: "Réception fournisseur",
        },
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    useEffect(() => {
        async function fetchData() {
            try {
                const [productsRes, locationsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/stock/locations'),
                    api.get('/products/categories')
                ]);
                setProducts(productsRes.data);
                setLocations(locationsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setError("Impossible de charger les données.");
            }
        }
        fetchData();
    }, []);

    const filteredProducts = selectedCategory && selectedCategory !== "all"
        ? products.filter(p => p.category?.id?.toString() === selectedCategory)
        : products;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await api.post('/stock/add', {
                ...values,
                productId: parseInt(values.productId),
                locationId: values.locationId ? parseInt(values.locationId) : undefined,
            });
            setSuccess(true);
            form.reset();
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            console.error('Stock entry failed:', err);
            setError(err.response?.data?.message || err.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <div className="space-y-2">
                    <FormLabel>Filtrer par Catégorie</FormLabel>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les catégories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

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
                                    {filteredProducts.map((product) => (
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

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="batchNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Numéro de Lot (Batch)</FormLabel>
                                <FormControl>
                                    <Input placeholder="LOT-123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantité</FormLabel>
                                <FormControl>
                                    <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="expirationDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>DLU (Date Limite d'Utilisation)</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="locationId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Emplacement (Optionnel)</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un emplacement" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {locations.map((loc) => (
                                            <SelectItem key={loc.id} value={loc.id.toString()}>
                                                {loc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Motif</FormLabel>
                            <FormControl>
                                <Input placeholder="Réception fournisseur" {...field} />
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
                        <AlertDescription>Stock ajouté avec succès !</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Enregistrement...' : 'Enregistrer l\'entrée de stock'}
                </Button>
            </form>
        </Form>
    );
}
