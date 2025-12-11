"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mockTrendData = [
    { month: "Jan", value: 45000 },
    { month: "Feb", value: 52000 },
    { month: "Mar", value: 48000 },
    { month: "Apr", value: 61000 },
    { month: "May", value: 55000 },
    { month: "Jun", value: 67000 },
    { month: "Jul", value: 72000 },
];

const mockCategoryData = [
    { name: "Antibiotics", value: 400 },
    { name: "Painkillers", value: 300 },
    { name: "Vitamins", value: 300 },
    { name: "First Aid", value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function AnalyticsData() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 glass border-none text-white">
                <CardHeader>
                    <CardTitle>Stock Value Trends</CardTitle>
                    <CardDescription className="text-gray-400">
                        Evolution of total stock value over the last 6 months.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={mockTrendData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="oklch(0.65 0.18 190)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="oklch(0.65 0.18 190)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="month"
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
                                tickFormatter={(value) => `€${value / 1000}k`}
                                tick={{ fill: '#9ca3af' }}
                            />
                            <Tooltip
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                                contentStyle={{
                                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="oklch(0.65 0.18 190)"
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="col-span-3 glass border-none text-white">
                <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription className="text-gray-400">
                        Stock items by category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={mockCategoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {mockCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '0.75rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff'
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
