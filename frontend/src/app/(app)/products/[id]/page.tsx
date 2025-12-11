import { notFound } from "next/navigation";

import { Package, Calendar, AlertTriangle, History, ArrowUpRight, ArrowDownRight } from "lucide-react";

import api from "@/lib/api";
import { Product } from "@/types/product";
import { StockItem, StockMovement } from "@/types/stock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddStockDialog } from "@/components/stock/AddStockDialog";
import { DispatchStockDialog } from "@/components/stock/DispatchStockDialog";
import { Badge } from "@/components/ui/badge"; // Need to check if Badge exists, if not I'll use span with classes.
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Helper to fetch data
async function getProduct(id: number): Promise<Product | null> {
    try {
        const res = await api.get(`/products/${id}`);
        return res.data;
    } catch (e) {
        return null;
    }
}

async function getStock(id: number): Promise<StockItem[]> {
    try {
        const res = await api.get(`/stock/${id}`);
        return res.data;
    } catch (e) {
        return [];
    }
}

async function getHistory(id: number): Promise<StockMovement[]> {
    try {
        const res = await api.get(`/stock/history/${id}`);
        return res.data;
    } catch (e) {
        return [];
    }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const productId = parseInt(id);

    const product = await getProduct(productId);
    if (!product) notFound();

    const stockItems = await getStock(productId);
    const history = await getHistory(productId);

    const totalStock = stockItems.reduce((acc, item) => acc + item.quantity, 0);

    // Calculate expiry status
    const now = new Date();
    const expiringSoon = stockItems.filter(item => {
        const expiry = new Date(item.expiryDate);
        const diffTime = expiry.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays > 0;
    });

    const expired = stockItems.filter(item => new Date(item.expiryDate) <= now);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                    <p className="text-muted-foreground">SKU: {product.sku || 'N/A'} • {product.category?.name || 'Uncategorized'}</p>
                </div>
                <div className="flex gap-2">
                    <AddStockDialog productId={productId} />
                    <DispatchStockDialog productId={productId} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStock}</div>
                        <p className="text-xs text-muted-foreground">
                            Across {stockItems.length} lots
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{expiringSoon.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Lots expiring in 30 days
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expired</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{expired.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Lots already expired
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="lots" className="w-full">
                <TabsList>
                    <TabsTrigger value="lots">Stock Lots</TabsTrigger>
                    <TabsTrigger value="history">Movement History</TabsTrigger>
                </TabsList>
                <TabsContent value="lots" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Stock Lots</CardTitle>
                            <CardDescription>Manage individual lots and their expiry dates.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Lot Number</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Expiry Date</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stockItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">No stock available.</TableCell>
                                        </TableRow>
                                    ) : (
                                        stockItems.map((item) => {
                                            const expiry = new Date(item.expiryDate);
                                            const isExpired = expiry <= now;
                                            const isExpiringSoon = !isExpired && (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 30;

                                            return (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.lotNumber}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{expiry.toLocaleDateString()}</TableCell>
                                                    <TableCell>{item.location?.name || '-'}</TableCell>
                                                    <TableCell>
                                                        {isExpired ? (
                                                            <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">Expired</span>
                                                        ) : isExpiringSoon ? (
                                                            <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700">Expiring Soon</span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">Valid</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="history" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Movement History</CardTitle>
                            <CardDescription>Recent stock changes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>User</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-muted-foreground">No history available.</TableCell>
                                        </TableRow>
                                    ) : (
                                        history.map((move) => (
                                            <TableRow key={move.id}>
                                                <TableCell>{new Date(move.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    {move.type === 'IN' ? (
                                                        <span className="flex items-center text-green-600"><ArrowUpRight className="mr-1 h-4 w-4" /> IN</span>
                                                    ) : move.type === 'OUT' ? (
                                                        <span className="flex items-center text-red-600"><ArrowDownRight className="mr-1 h-4 w-4" /> OUT</span>
                                                    ) : (
                                                        <span className="flex items-center text-blue-600"><History className="mr-1 h-4 w-4" /> ADJ</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className={move.quantityChange > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                                    {move.quantityChange > 0 ? `+${move.quantityChange}` : move.quantityChange}
                                                </TableCell>
                                                <TableCell>{move.reason}</TableCell>
                                                <TableCell>{move.user?.username || 'System'}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
