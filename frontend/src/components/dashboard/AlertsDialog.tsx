import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, TrendingDown, CalendarClock, Beaker } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Product {
    id: number;
    name: string;
    minThreshold: number;
}

interface Batch {
    id: number;
    batchNumber: string;
    quantity: number;
    expirationDate: string;
    product: Product;
}

interface AlertsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    alerts: {
        lowStock: Batch[];
        expiringSoon: Batch[];
    } | null;
}

export function AlertsDialog({ open, onOpenChange, alerts }: AlertsDialogProps) {
    if (!alerts) return null;

    const lowStockCount = alerts.lowStock.length;
    const expiringCount = alerts.expiringSoon.length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                        <Beaker className="h-6 w-6" />
                        <span className="font-semibold tracking-wide text-sm uppercase">StockCare AI Prediction</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Attention Requise
                        {(lowStockCount + expiringCount) > 0 && (
                            <Badge variant="destructive" className="rounded-full px-2">
                                {lowStockCount + expiringCount}
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Notre système de prédiction a détecté des anomalies dans votre inventaire qui nécessitent une action immédiate.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue={lowStockCount > 0 ? "low-stock" : "expiring"} className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="low-stock" className="flex gap-2">
                            <TrendingDown className="h-4 w-4" />
                            Rupture ({lowStockCount})
                        </TabsTrigger>
                        <TabsTrigger value="expiring" className="flex gap-2">
                            <CalendarClock className="h-4 w-4" />
                            Expiration ({expiringCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="low-stock" className="mt-4">
                        <ScrollArea className="h-[50vh] pr-4">
                            {lowStockCount === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <div className="bg-green-100 p-3 rounded-full mb-3 dark:bg-green-900/20">
                                        <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p>Aucun risque de rupture détecté.</p>
                                </div>
                            ) : (
                                <div className="grid gap-3 pb-24 px-1">
                                    {alerts.lowStock.map((batch) => (
                                        <Card key={batch.id} className="p-4 border-l-4 border-l-red-500 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                            <div className="space-y-1">
                                                <div className="font-semibold text-lg">{batch.product.name}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    lot: <span className="font-mono bg-muted px-1 rounded">{batch.batchNumber}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-red-600">
                                                    {batch.quantity} <span className="text-xs font-normal text-muted-foreground">unités</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Seuil min: {batch.product.minThreshold}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="expiring" className="mt-4">
                        <ScrollArea className="h-[50vh] pr-4">
                            {expiringCount === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <div className="bg-green-100 p-3 rounded-full mb-3 dark:bg-green-900/20">
                                        <CalendarClock className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p>Aucun produit n'expire dans les 30 jours.</p>
                                </div>
                            ) : (
                                <div className="grid gap-3 pb-24 px-1">
                                    {alerts.expiringSoon.map((batch) => {
                                        const daysLeft = Math.ceil((new Date(batch.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                        const isUrgent = daysLeft <= 7;

                                        return (
                                            <Card key={batch.id} className={`p-4 border-l-4 ${isUrgent ? 'border-l-red-500' : 'border-l-orange-400'} flex justify-between items-center shadow-sm hover:shadow-md transition-shadow`}>
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-lg">{batch.product.name}</div>
                                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                        lot: <span className="font-mono bg-muted px-1 rounded">{batch.batchNumber}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`font-bold ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                                                        {new Date(batch.expirationDate).toLocaleDateString()}
                                                    </div>
                                                    <Badge variant={isUrgent ? "destructive" : "outline"} className="mt-1">
                                                        J-{daysLeft}
                                                    </Badge>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
