"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from 'react';
import api from '@/lib/api';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

interface CategoryFormProps {
    onSuccess: () => void;
    initialData?: { id: number; name: string };
}

export function CategoryForm({ onSuccess, initialData }: CategoryFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({ name: initialData.name });
        } else {
            form.reset({ name: "" });
        }
    }, [initialData, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            if (initialData) {
                await api.put(`/products/categories/${initialData.id}`, values);
            } else {
                await api.post('/products/categories', values);
            }
            form.reset();
            onSuccess();
        } catch (err: any) {
            console.error('Failed to save category:', err);
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
                            <FormLabel>Nom de la catégorie</FormLabel>
                            <FormControl>
                                <Input placeholder="Antibiotiques, Antalgiques..." {...field} />
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

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Enregistrement...' : (initialData ? 'Modifier la catégorie' : 'Ajouter la catégorie')}
                </Button>
            </form>
        </Form>
    );
}
