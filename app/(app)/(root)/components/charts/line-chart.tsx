"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A line chart";

interface ChartLineProps {
  data?: any[];
  xAxis?: string;
  yAxis?: string;
  title?: string;
  description?: string;
}

export function ChartLine({
  data = [],
  xAxis = "x",
  yAxis = "y",
  title = "Line Chart",
  description = "Data visualization"
}: ChartLineProps) {
  // Create chart config dynamically
  const chartConfig = {
    [yAxis]: {
      label: yAxis,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // Show empty state if no data
  if (!data || data.length === 0) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-gray-500">
            <div className="text-center">
              <div>No data available</div>
              <div className="text-sm mt-1">Configure chart axes to display data</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxis}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => 
                typeof value === 'string' && value.length > 10 
                  ? value.slice(0, 10) + '...' 
                  : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={yAxis}
              type="natural"
              stroke={`var(--color-${yAxis})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Data visualization <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing {data.length} data points
        </div>
      </CardFooter>
    </Card>
  );
}
