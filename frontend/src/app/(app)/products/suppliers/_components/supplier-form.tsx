"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from 'react';
import api from '@/lib/api';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    contactPerson: z.string().optional(),
    contactEmail: z.string().email("Email invalide").optional().or(z.literal('')),
    contactPhone: z.string().optional(),
});

interface SupplierFormProps {
    onSuccess: () => void;
    initialData?: {
        id: number;
        name: string;
        contactPerson?: string;
        contactEmail?: string;
        contactPhone?: string;
    };
}

export function SupplierForm({ onSuccess, initialData }: SupplierFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            contactPerson: initialData?.contactPerson || "",
            contactEmail: initialData?.contactEmail || "",
            contactPhone: initialData?.contactPhone || "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            if (initialData) {
                await api.put(`/products/suppliers/${initialData.id}`, values);
            } else {
                await api.post('/products/suppliers', values);
            }
            form.reset();
            onSuccess();
        } catch (err: any) {
            console.error('Failed to create supplier:', err);
            setError(err.response?.data?.message || err.message || 'Une erreur est survenue');
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
                            <FormLabel>Nom du fournisseur</FormLabel>
                            <FormControl>
                                <Input placeholder="Pfizer, Sanofi..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact (Personne)</FormLabel>
                            <FormControl>
                                <Input placeholder="M. Dupont" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="contact@labo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Téléphone</FormLabel>
                                <FormControl>
                                    <Input placeholder="01 23 45 67 89" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Enregistrement...' : (initialData ? 'Modifier' : 'Ajouter le fournisseur')}
                </Button>
            </form>
        </Form>
    );
}
