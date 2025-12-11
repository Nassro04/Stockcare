"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import api from "@/lib/api";
import { DashboardStats } from "@/types/dashboard";
import type { StockMovement } from "@/types/stock";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types/products";

import { ConsumptionChart } from "@/components/dashboard/ConsumptionChart";
import { AnalyticsData } from "@/components/dashboard/AnalyticsData";
import { ReportsList } from "@/components/dashboard/ReportsList";

import { AlertsDialog } from "@/components/dashboard/AlertsDialog";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<StockMovement[]>([]);
  const [consumption, setConsumption] = useState<{ date: string; totalConsumption: number }[]>([]);
  const [alerts, setAlerts] = useState<any>(null);
  const [showAletrts, setShowAlerts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasCheckedAlerts, setHasCheckedAlerts] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("all");

  // Fetch only consumption data when product filter changes
  useEffect(() => {
    async function fetchConsumption() {
      try {
        const query = selectedProductId !== "all" ? `?productId=${selectedProductId}` : "";
        const res = await api.get(`/dashboard/consumption${query}`);
        setConsumption(res.data);
      } catch (error) {
        console.error("Failed to fetch consumption", error);
      }
    }
    // Only fetch if initial load is done (to avoid double fetch on mount)
    if (!loading) {
      fetchConsumption();
    }
  }, [selectedProductId, loading]);

  const handleExport = async (endpoint: string, filename: string) => {
    try {
      const response = await api.get(endpoint, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download export", error);
      alert("Erreur lors du téléchargement");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, activityRes, consumptionRes, alertsRes, productsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/recent-activity'),
          api.get('/dashboard/consumption'),
          api.get('/dashboard/alerts'),
          api.get('/products')
        ]);

        setStats(statsRes.data);
        setActivity(activityRes.data);
        setConsumption(consumptionRes.data);
        setAlerts(alertsRes.data);
        setProducts(productsRes.data);

        // Auto-open if there are any alerts and we haven't checked yet
        const hasAlerts = (alertsRes.data.lowStock && alertsRes.data.lowStock.length > 0) ||
          (alertsRes.data.expiringSoon && alertsRes.data.expiringSoon.length > 0);

        if (hasAlerts && !hasCheckedAlerts) {
          setShowAlerts(true);
          setHasCheckedAlerts(true);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    }

    if (!hasCheckedAlerts) {
      fetchData();
    }
  }, [hasCheckedAlerts]);

  if (loading) {
    return <div className="flex items-center justify-center h-full">Loading dashboard...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <AlertsDialog open={showAletrts} onOpenChange={setShowAlerts} alerts={alerts} />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Valeur du Stock"
              value={new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(stats?.totalStockValue || 0)}
              icon={Package}
              description="Valorisation totale"
            />
            <StatsCard
              title="Total Stock Units"
              value={stats?.totalStockItems || 0}
              icon={Activity}
              description="Total physical items"
            />
            <StatsCard
              title="Low Stock Alerts"
              value={stats?.lowStockCount || 0}
              icon={AlertTriangle}
              description="Products below threshold"
              onClick={() => setShowAlerts(true)}
            />
            <StatsCard
              title="Expiring Soon"
              value={stats?.expiringCount || 0}
              icon={TrendingUp}
              description="Lots expiring in 30 days"
              onClick={() => setShowAlerts(true)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Daily Consumption</CardTitle>
                  <CardDescription>
                    Total stock units dispatched.
                  </CardDescription>
                </div>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les produits</SelectItem>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="pl-2">
                <ConsumptionChart data={consumption} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest stock movements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity activities={activity} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsData />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <ReportsList />
        </TabsContent>
      </Tabs>
    </div >
  );
}
