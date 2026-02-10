"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";

interface ConsumptionChartProps {
    data: { date: string; totalConsumption: number }[];
}

export function ConsumptionChart({ data }: ConsumptionChartProps) {
    if (!data || data.length === 0) {
        return <div className="flex h-[350px] items-center justify-center text-muted-foreground">No data available</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <defs>
                    <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.65 0.18 190)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="oklch(0.65 0.18 190)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    tick={{ fill: '#9ca3af' }}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{
                        backgroundColor: 'rgba(20, 20, 30, 0.9)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                    }}
                    labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
                />
                <Bar
                    dataKey="totalConsumption"
                    fill="url(#colorConsumption)"
                    radius={[8, 8, 0, 0]}
                    barSize={60}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}
