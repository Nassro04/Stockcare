"use client";

import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleUser, Mail, Shield } from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuthStore();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">Mon Profil</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="glass border-none text-white">
                    <CardHeader>
                        <CardTitle>Informations Personnelles</CardTitle>
                        <CardDescription>Vos détails de compte</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-black/20">
                            <CircleUser className="h-10 w-10 text-primary" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nom d'utilisateur</p>
                                <p className="text-lg font-bold">{user?.username || 'Utilisateur'}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-black/20">
                            <Shield className="h-10 w-10 text-secondary" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                                <p className="text-lg font-bold">{user?.role || 'Rôle Inconnu'}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-black/20">
                            <Mail className="h-10 w-10 text-blue-400" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-lg font-bold">{user?.email || 'Non renseigné'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
