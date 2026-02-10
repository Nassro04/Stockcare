"use client";

import { useState, useEffect, Fragment } from 'react';
import api from '@/lib/api';
import { CategoryForm } from './_components/category-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Category {
    id: number;
    name: string;
    products?: { id: number; name: string }[];
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/products/categories');
            setCategories(res.data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
        try {
            await api.delete(`/products/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) setEditingCategory(null);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
                    <p className="text-muted-foreground">Gérer les familles de produits.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingCategory(null)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouvelle Catégorie
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                            initialData={editingCategory || undefined}
                            onSuccess={() => {
                                setIsDialogOpen(false);
                                setEditingCategory(null);
                                fetchCategories();
                            }} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des catégories</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead className="text-right">ID</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        Aucune catégorie enregistrée.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <Fragment key={category.id}>
                                        <TableRow className="bg-muted/50">
                                            <TableCell className="font-medium text-lg text-primary">{category.name}</TableCell>
                                            <TableCell className="text-right">{category.id}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(category.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent border-b-4 border-b-transparent">
                                            <TableCell colSpan={3} className="p-0 pb-4">
                                                <div className="bg-black/20 rounded-b-lg border-x border-b border-muted p-4 ml-4 mr-4 mb-2 space-y-2">
                                                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                                                        Produits associés ({category.products?.length || 0})
                                                    </h4>
                                                    {category.products && category.products.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                            {category.products.map((p) => (
                                                                <div key={p.id} className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border">
                                                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                                    <span className="text-sm truncate">{p.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground italic">Aucun produit dans cette catégorie.</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
