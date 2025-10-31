import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
Card,
CardAction,
CardDescription,
CardFooter,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import { useCallback, useEffect, useState } from "react";
import { getTotalRevenue } from "@/api/DashboardApi";
import type { SectionCards } from "@/interface/Dashboard.interface";

export function SectionCards() {

    const [totalRevenue, setTotalRevenue] = useState<SectionCards>();
    const [totalUnitSold, setTotalUnitSold] = useState<SectionCards>();
    const [totalTransaction, settotalTransaction] = useState<SectionCards>();
    const [totalCustomers, setTotalCustomers] = useState<SectionCards>();
    
    const sectionCardsData = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        if (!token){
            return;
        }
        try {
            const responseTotalRevenue = await getTotalRevenue(token);
            if(responseTotalRevenue && responseTotalRevenue.data){
                setTotalRevenue(responseTotalRevenue.data);
            }

            const responseTotalUnitSold = await getTotalRevenue(token);
            if(responseTotalUnitSold && responseTotalUnitSold.data){
                setTotalUnitSold(responseTotalUnitSold.data);
            }

            const responseTotalTransaction = await getTotalRevenue(token);
            if(responseTotalTransaction && responseTotalTransaction.data){
                settotalTransaction(responseTotalTransaction.data);
            }

            const responseTotalCustomers = await getTotalRevenue(token);
            if(responseTotalCustomers && responseTotalCustomers.data){
                setTotalCustomers(responseTotalCustomers.data);
            }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, []);
    
    useEffect(() => {
        sectionCardsData();
    }, [sectionCardsData]);
    

return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-[#010d2b] grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    <Card className="@container/card">
        <CardHeader>
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-500">
                Rp {totalRevenue?.total}
            </CardTitle>
            <CardAction>
                <Badge variant="outline"  className="text-green-500">
                <IconTrendingUp/>
                +12.5%
                </Badge>
            </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
                {totalRevenue?.desc} <IconTrendingUp className="size-4 text-green-500" />
            </div>
            <div className="text-muted-foreground">
                Acquisition needs attention
            </div>
        </CardFooter>
    </Card>
    <Card className="@container/card">
        <CardHeader>
            <CardDescription>Units Sold</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-red-500">
                {totalUnitSold?.total}
            </CardTitle>
            <CardAction>
                <Badge variant="outline" className="text-red-500">
                <IconTrendingDown />
                -20%
                </Badge>
            </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
                {totalRevenue?.desc} <IconTrendingDown className="size-4 text-red-500" />
            </div>
            <div className="text-muted-foreground">
                Acquisition needs attention
            </div>
        </CardFooter>
    </Card>
    <Card className="@container/card">
        <CardHeader>
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-500">
                {totalTransaction?.total}
            </CardTitle>
            <CardAction>
                <Badge variant="outline" className="text-green-500">
                <IconTrendingUp />
                +12.5%
                </Badge>
            </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
                {totalRevenue?.desc} <IconTrendingUp className="size-4 text-green-500" />
            </div>
            <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
    </Card>
    <Card className="@container/card">
        <CardHeader>
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-green-500">
                {totalCustomers?.total}
            </CardTitle>
            <CardAction>
                <Badge variant="outline" className="text-green-500">
                <IconTrendingUp />
                +12.5%
                </Badge>
            </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
                {totalRevenue?.desc} <IconTrendingUp className="size-4 text-green-500" />
            </div>
            <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
    </Card>
    
    </div>
)
}