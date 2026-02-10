"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, Smartphone } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [marketing, setMarketing] = useState(false);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">Paramètres</h2>

            <div className="grid gap-4">
                <Card className="glass border-none text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Moon className="h-5 w-5 text-purple-400" />
                            Apparence
                        </CardTitle>
                        <CardDescription>Personnaliser l'interface</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                            <div className="space-y-0.5">
                                <Label className="text-base">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">Thème sombre activé par défaut</p>
                            </div>
                            <Switch checked={true} disabled />
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass border-none text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-yellow-400" />
                            Notifications
                        </CardTitle>
                        <CardDescription>Gérer vos alertes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                            <div className="space-y-0.5">
                                <Label className="text-base">Alertes de Stock Faible</Label>
                                <p className="text-sm text-muted-foreground">Recevoir une notification quand un produit est bas</p>
                            </div>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-black/20">
                            <div className="space-y-0.5">
                                <Label className="text-base">Emails Marketing</Label>
                                <p className="text-sm text-muted-foreground">Recevoir des news sur StockCare</p>
                            </div>
                            <Switch checked={marketing} onCheckedChange={setMarketing} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
