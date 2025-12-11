"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

interface AuditLog {
    id: number;
    actionType: string;
    entityAffected?: string;
    oldValue?: any;
    newValue?: any;
    createdAt: string;
    user: {
        username: string;
    };
}

export default function AuditPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get('/audit');
                setLogs(res.data);
            } catch (err: any) {
                console.error("Failed to fetch audit logs", err);
                if (err.response?.status === 403) {
                    setError("Accès refusé. Vous n'avez pas les droits nécessaires pour voir les logs d'audit.");
                } else {
                    setError("Erreur lors du chargement des logs.");
                }
            }
        };
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <p className="text-muted-foreground">Historique des actions sensibles.</p>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Activités récentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Détails</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        {error ? 'Impossible d\'afficher les données.' : 'Aucun log trouvé.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                        </TableCell>
                                        <TableCell className="font-medium">{log.user?.username || 'Système'}</TableCell>
                                        <TableCell>{log.actionType} {log.entityAffected ? `(${log.entityAffected})` : ''}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                                            {log.newValue ? JSON.stringify(log.newValue, null, 2) : (log.oldValue ? JSON.stringify(log.oldValue, null, 2) : '-')}
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
