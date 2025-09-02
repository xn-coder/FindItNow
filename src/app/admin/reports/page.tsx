
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
import { FileDown, Users, Star, Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useEffect, useState, useTransition } from "react"
import { getDashboardAnalytics, exportReports } from "@/lib/actions"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isExporting, startExportTransition] = useTransition();

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

  const triggerDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };


  const handleExport = () => {
    startExportTransition(async () => {
        try {
            toast({ title: t('adminExporting'), description: t('adminExportingDesc') });
            const reports = await exportReports();
            triggerDownload('items.csv', reports.items);
            triggerDownload('claims.csv', reports.claims);
            triggerDownload('users.csv', reports.users);
            triggerDownload('partners.csv', reports.partners);
            toast({ title: t('adminExportComplete'), description: t('adminExportCompleteDesc') });
        } catch (error) {
            toast({ variant: "destructive", title: t('adminExportFailed'), description: t('adminExportFailedDesc') });
        }
    })
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">{t('adminReportsTitle')}</h1>
                <p className="text-muted-foreground">{t('adminReportsDesc')}</p>
            </div>
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
                {t('export')}
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>{t('adminChartTitleItems')}</CardTitle>
                    <CardDescription>{t('adminChartDescMonths')}</CardDescription>
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
                    <CardTitle className="text-sm font-medium">{t('adminChartTitleActiveUsers')}</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {loading ? (
                       <Skeleton className="h-8 w-1/2 mt-2"/>
                    ) : (
                        <div className="text-2xl font-bold">{analytics?.activeUsersCount}</div>
                    )}
                    <p className="text-xs text-muted-foreground">{t('adminChartDescActiveUsers')}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{t('adminChartTitleSatisfaction')}</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     {loading ? (
                        <Skeleton className="h-8 w-1/2 mt-2"/>
                    ) : (
                        <div className="text-2xl font-bold">{analytics?.partnerSatisfaction} / 5</div>
                    )}
                    <p className="text-xs text-muted-foreground">{t('adminChartDescSatisfaction')}</p>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
