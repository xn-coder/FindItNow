
"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { FileDown, Users, Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { getDashboardAnalytics } from "@/lib/actions"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  posted: {
    label: "Posted",
    color: "hsl(var(--chart-1))",
  },
  resolved: {
    label: "Resolved",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type AnalyticsData = {
    monthlyStats: { month: string; posted: number; resolved: number }[];
    activeUsersCount: number;
    partnerSatisfaction: string;
};

export default function ReportsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getDashboardAnalytics();
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
            // Optionally, show a toast message here
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground">View platform analytics and export reports.</p>
            </div>
            <Button variant="outline" disabled>
                <FileDown className="mr-2 h-4 w-4" />
                Export
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>Items Posted vs. Resolved</CardTitle>
                    <CardDescription>Last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[200px] w-full" />
                  ) : (
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart accessibilityLayer data={analytics?.monthlyStats}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="posted" fill="var(--color-posted)" radius={4} />
                            <Bar dataKey="resolved" fill="var(--color-resolved)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? (
                       <Skeleton className="h-8 w-1/2 mt-2"/>
                    ) : (
                        <div className="text-2xl font-bold">{analytics?.activeUsersCount}</div>
                    )}
                    <p className="text-xs text-muted-foreground">Users active in the last 30 days.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Partner Satisfaction</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {loading ? (
                        <Skeleton className="h-8 w-1/2 mt-2"/>
                    ) : (
                        <div className="text-2xl font-bold">{analytics?.partnerSatisfaction} / 5</div>
                    )}
                    <p className="text-xs text-muted-foreground">Average rating from resolved cases.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
