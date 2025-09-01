
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Package, ShieldCheck, Handshake } from "lucide-react";

export default function AdminDashboardPage() {
  // In a real app, you would fetch this data
  const stats = {
    totalItems: 1250,
    activeClaims: 75,
    resolvedCases: 890,
    partnerContributions: 320,
  };

  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalItems}</div>
                    <p className="text-xs text-muted-foreground">600 Lost vs. 650 Found</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Claims</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeClaims}</div>
                    <p className="text-xs text-muted-foreground">Currently in progress</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
                    <Handshake className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.resolvedCases}</div>
                    <p className="text-xs text-muted-foreground">Successful reunions</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Partner Contributions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.partnerContributions}</div>
                    <p className="text-xs text-muted-foreground">Items posted by partners</p>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Recent activity feed will be implemented here.</p>
            </CardContent>
        </Card>
    </div>
  );
}
