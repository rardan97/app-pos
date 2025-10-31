import { IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
Card,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card"
import { useCallback, useEffect, useRef, useState } from "react";
import type { PopularProductRes, PopularTypeOrderRes } from "@/interface/Dashboard.interface";
import { getPopularProduct, getPopularTypeOrder } from "@/api/DashboardApi";



export function MostCards() {

    const hasFetched = useRef(false);
    const [popularProduct, setPopularProduct] = useState<PopularProductRes[]>([]);
    const [popularTypeOrder, setPopularTypeOrder] = useState<PopularTypeOrderRes[]>([]);
         
    const getListAllPopulerProduct = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        if (!token){
            return;
        }
        try {
            const responsePopularProduct = await getPopularProduct(token);
            if(responsePopularProduct && responsePopularProduct.data){
                console.log("Success processing data");
                setPopularProduct(responsePopularProduct.data);
            }

            const responsePopularTypeOrder = await getPopularTypeOrder(token);
            if(responsePopularTypeOrder && responsePopularTypeOrder.data){
                console.log("Success processing data");
                setPopularTypeOrder(responsePopularTypeOrder.data);
            }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        console.log(hasFetched);
        if (!hasFetched.current) {
            getListAllPopulerProduct();
            hasFetched.current = true;
        }
        }, [getListAllPopulerProduct]);

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-[#010d2b] grid grid-cols-1 gap-4 px-4  *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-2">
        <Card className="@container/card">
        {/* Header */}
        <CardHeader>
            <CardTitle className="text-2xl font-semibold">Most Popular Products</CardTitle>
            <CardDescription>
            Here are the top-selling products for this month, showing trends and sales numbers.
            </CardDescription>
        </CardHeader>

        {/* Product list */}
        <div className="divide-y divide-border">
            {popularProduct.map((product) => (
            <div
                key={product.productId}
                className="flex items-center justify-between px-6 py-3 text-sm"
            >
                <div className="flex flex-col">
                <span className="font-medium">{product.productName}</span>
                <span className="text-muted-foreground">${product.productPrice.toFixed(2)}</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                <IconTrendingUp className="size-3 text-green-500" />
                {product.productTotal}
                </Badge>
            </div>
            ))}
        </div>
        </Card>




        <Card className="@container/card">
        {/* Header */}
        <CardHeader>
            <CardTitle className="text-2xl font-semibold">Most Popular Order Type</CardTitle>
            <CardDescription>
            Here are the top-selling products for this month, showing trends and sales numbers.
            </CardDescription>
        </CardHeader>
        {/* Product list */}
        <div className="divide-y divide-border">
            {popularTypeOrder.map((typeOrder) => (
            <div
                key={typeOrder.typeOrderId}
                className="flex items-center justify-between px-6 py-5 text-sm"
            >
                <div className="flex flex-col">
                <span className="font-medium">{typeOrder.typeOrderName}</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                <IconTrendingUp className="size-3 text-green-500" />
                {typeOrder.typeOrderTotal}
                </Badge>
            </div>
            ))}
        </div>
        </Card>
        
        
        
        </div>
    )
}