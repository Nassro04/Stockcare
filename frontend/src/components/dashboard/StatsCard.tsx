import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
    onClick?: () => void;
}

export function StatsCard({ title, value, description, icon: Icon, trend, onClick }: StatsCardProps) {
    return (
        <Card
            className={`glass glass-hover border-none text-white ${onClick ? 'cursor-pointer hover:bg-white/5 bg-black/20 transition-all active:scale-95' : ''}`}
            onClick={onClick}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">{title}</CardTitle>
                <div className="p-2 bg-white/5 rounded-lg">
                    <Icon className={`h-4 w-4 ${onClick ? 'text-amber-500' : 'text-primary'}`} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
                {description && (
                    <p className="text-xs text-gray-400 mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
