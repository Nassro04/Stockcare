"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { SupplierForm } from './_components/supplier-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Supplier {
    id: number;
    name: string;
    contactPerson?: string;
    contactEmail?: string;
    contactPhone?: string;
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchSuppliers = async () => {
        try {
            const res = await api.get('/products/suppliers');
            setSuppliers(res.data);
        } catch (err) {
            console.error("Failed to fetch suppliers", err);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);


    const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);

    const handleDelete = async (id: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce fournisseur ?")) return;
        try {
            await api.delete(`/products/suppliers/${id}`);
            fetchSuppliers();
        } catch (err) {
            console.error("Failed to delete supplier", err);
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
                    <p className="text-muted-foreground">Gérer la liste des fournisseurs et laboratoires.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    if (!open) setEditingSupplier(undefined);
                    setIsDialogOpen(open);
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setEditingSupplier(undefined)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nouveau Fournisseur
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingSupplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}</DialogTitle>
                        </DialogHeader>
                        <SupplierForm
                            initialData={editingSupplier}
                            onSuccess={() => {
                                setIsDialogOpen(false);
                                setEditingSupplier(undefined);
                                fetchSuppliers();
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des fournisseurs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Téléphone</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suppliers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        Aucun fournisseur enregistré.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                suppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="font-medium">{supplier.name}</TableCell>
                                        <TableCell>{supplier.contactPerson || '-'}</TableCell>
                                        <TableCell>{supplier.contactEmail || '-'}</TableCell>
                                        <TableCell>{supplier.contactPhone || '-'}</TableCell>
                                        <TableCell className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => {
                                                setEditingSupplier(supplier);
                                                setIsDialogOpen(true);
                                            }}>Modifier</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(supplier.id)}>Supprimer</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
