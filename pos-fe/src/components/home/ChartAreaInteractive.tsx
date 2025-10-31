import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getTransactionChart } from "@/api/DashboardApi";
import type { TransactionChartRes } from "@/interface/Dashboard.interface";
import { useCallback, useEffect, useRef, useState } from "react";

export const description = "An interactive area chart";

const chartConfig = {
  food: {
    label: "Food",
    color: "var(--color-food)",
  },
  drink: {
    label: "Drink",
    color: "var(--color-drink)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const hasFetched = useRef(false);
  const isMobile = useIsMobile();
  const [transactionChart, setTransactionChart] = useState<TransactionChartRes[]>([]);
  const [chartData, setChartData] = useState<{ date: string; food: number; drink: number }[]>([]);
  const [timeRange, setTimeRange] = useState("90d");

  // 📱 Adjust range based on screen size
  useEffect(() => {
    if (isMobile) setTimeRange("7d");
  }, [isMobile]);

  // 🔹 Fetch Data from API (once)
  const getListTransactionChart = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const response = await getTransactionChart(token);
      if (response && response.data) {
        console.log("data chart:", response.data);
        setTransactionChart(response.data);
      }
    } catch (error) {
      console.error("❌ Failed fetching chart data:", error);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      getListTransactionChart();
      hasFetched.current = true;
    }
  }, [getListTransactionChart]);

  // 🔁 Transform data to chart format (date as string)
  useEffect(() => {
    if (transactionChart.length > 0) {
      const mappedData = transactionChart.map((item) => ({
        date: item.transactionDate, // tetap string, bukan Date
        food: item.transactionFood,
        drink: item.transactionDrink,
      }));
      setChartData(mappedData);
    }
  }, [transactionChart]);

  // 🧮 Filter Data by time range
  const filteredData = chartData.filter((item) => {
    const itemTime = new Date(item.date).getTime();
    const maxTime = Math.max(...chartData.map((d) => new Date(d.date).getTime()));

    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startTime = maxTime - daysToSubtract * 24 * 60 * 60 * 1000;
    return itemTime >= startTime;
  });

  return (
    <Card className="@container/card dark:bg-[#010d2b]">
      <CardHeader>
        <CardTitle>Transaction Summary</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total transactions for the last {timeRange.replace("d", " days")}
          </span>
          <span className="@[540px]/card:hidden">
            Last {timeRange.replace("d", " days")}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
  <linearGradient id="fillFood" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />   {/* biru gelap */}
    <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1} />  {/* biru muda */}
  </linearGradient>
  <linearGradient id="fillDrink" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8} />   {/* biru navy */}
    <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1} />  {/* biru muda */}
  </linearGradient>
</defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  indicator="dot"
                />
              }
            />

           <Area
  dataKey="drink"
  type="natural"
  fill="url(#fillDrink)"
  stroke="#1e40af"
  stackId="a"
/>
<Area
  dataKey="food"
  type="natural"
  fill="url(#fillFood)"
  stroke="#3b82f6"
  stackId="a"
/>
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}