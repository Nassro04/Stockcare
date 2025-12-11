"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { FileText, Download, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const reports = [
    {
        id: "RPT-001",
        name: "Monthly Stock Summary",
        date: "2025-12-01",
        type: "PDF",
        status: "Available"
    },
    {
        id: "RPT-002",
        name: "Low Stock Alert Report",
        date: "2025-12-08",
        type: "CSV",
        status: "Available"
    },
    {
        id: "RPT-003",
        name: "Supplier Performance Q4",
        date: "2025-11-30",
        type: "PDF",
        status: "Archived"
    },
    {
        id: "RPT-004",
        name: "Inventory Audit Log",
        date: "2025-12-05",
        type: "CSV",
        status: "Available"
    }
];

export function ReportsList() {
    const [isGenerating, setIsGenerating] = React.useState(false);

    const handleDownload = async () => {
        try {
            const response = await api.get('/dashboard/export', {
                responseType: 'blob',
            });

            // Create a blob from the response
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `stock-report-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download report. Please try again.');
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Call the correct endpoint for available stock
            const response = await api.get('/dashboard/export-stock', {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // Name the file appropriately for current date
            link.setAttribute('download', `stock-disponible-${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();

            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate report.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="glass border-none text-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Available Reports</CardTitle>
                    <CardDescription className="text-gray-400">
                        Download generated system reports.
                    </CardDescription>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                >
                    <Calendar className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Generate New Report'}
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-black/20 hover:bg-black/30 transition-colors border border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">{report.name}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>{report.date}</span>
                                        <span>•</span>
                                        <span>{report.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge variant="outline" className={report.status === 'Available' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' : 'border-gray-500/50 text-gray-400'}>
                                    {report.status}
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="hover:bg-white/10 text-gray-300"
                                    onClick={handleDownload}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
