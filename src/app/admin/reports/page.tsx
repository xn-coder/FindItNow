
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
import { FileDown } from "lucide-react"
import { useTranslation } from "react-i18next"

const chartData = [
  { month: "January", posted: 186, resolved: 80 },
  { month: "February", posted: 305, resolved: 200 },
  { month: "March", posted: 237, resolved: 120 },
  { month: "April", posted: 273, resolved: 190 },
  { month: "May", posted: 209, resolved: 130 },
  { month: "June", posted: 214, resolved: 140 },
]

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

export default function ReportsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground">View platform analytics and export reports.</p>
            </div>
            <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader>
                    <CardTitle>Items Posted vs. Resolved</CardTitle>
                    <CardDescription>January - June 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart accessibilityLayer data={chartData}>
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
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Active Users</CardTitle>
                    <CardDescription>Users who have been active in the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">5,231</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Partner Satisfaction</CardTitle>
                    <CardDescription>Average rating from resolved cases.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">4.8 / 5</div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
