"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Batch } from "@/types/stock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isValid } from "date-fns";

interface Location {
    id: number;
    name: string;
    description: string;
    batchCount?: number;
}

export default function InventoryPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [stock, setStock] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchLocations() {
            try {
                const response = await api.get('/stock/locations');
                setLocations(response.data);
                if (response.data.length > 0) {
                    setSelectedLocation(response.data[0].id.toString());
                }
            } catch (error) {
                console.error("Failed to fetch locations", error);
            }
        }
        fetchLocations();
    }, []);

    useEffect(() => {
        if (!selectedLocation) return;

        async function fetchStock() {
            setLoading(true);
            try {
                const response = await api.get(`/stock/location/${selectedLocation}`);
                setStock(response.data);
            } catch (error) {
                console.error("Failed to fetch stock", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStock();
    }, [selectedLocation]);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Inventaire par Établissement</h2>
            </div>
            <div className="flex items-center space-x-4">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-[280px]">
                        <SelectValue placeholder="Sélectionner un établissement" />
                    </SelectTrigger>
                    <SelectContent>
                        {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id.toString()}>
                                {location.name} ({location.batchCount || 0})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Stock Actuel</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-4">Chargement...</div>
                    ) : stock.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">Aucun stock trouvé pour cet établissement.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>Lot</TableHead>
                                    <TableHead>Quantité</TableHead>
                                    <TableHead>Expiration</TableHead>
                                    <TableHead>Reçu le</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stock.map((item) => {
                                    const expirationDate = new Date(item.expirationDate);
                                    const isExpired = isValid(expirationDate) && expirationDate < new Date();

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.product.name}</TableCell>
                                            <TableCell>{item.batchNumber}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell className={isExpired ? "text-red-500 font-bold" : ""}>
                                                {isValid(expirationDate) ? format(expirationDate, 'dd/MM/yyyy') : 'N/A'}
                                            </TableCell>
                                            <TableCell>{item.receivedAt ? format(new Date(item.receivedAt), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
