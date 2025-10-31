import { checkoutTransactionStatus } from "@/api/KasirApi";
import { useTransaction } from "@/context/TransactionContext";
import type { TransactionItemDto, TransactionReq } from "@/interface/Transaction.interface";
import { useRef, useState } from "react";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";

const PaymentComponent: React.FC = () => {
    const snapContainerRef = useRef<HTMLDivElement>(null);
    const { transactionData } = useTransaction();
    const [isSnapOpen, setIsSnapOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    if (!transactionData) return <p>Tidak ada data transaksi.</p>;

    const total = transactionData.data?.itemDetails.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

    
    const handleAdToSTransaction = async (transactionId: string, statusCode: string, orderId: string, currency: string, grossAmount: string,
        paymentType: string, transactionStatus: string, statusMessage: string, transactionTime: string, settlementTime: string
    ) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const transformed: TransactionItemDto[] = transactionData.data?.itemDetails.map((item) => ({
            productId: item.id,
            productHarga: String(item.price),
            productQty: Number(item.quantity),
            subTotalAmount: String(Number(item.price) * Number(item.quantity)),
        })) ?? [];


        console.log("==================================");
        console.log("transactionId :"+transactionId);
        console.log("statusCode :"+statusCode);
        console.log("orderId :"+orderId);
        console.log("currency :"+currency);
        console.log("grossAmount :"+grossAmount);
        console.log("paymentType :"+paymentType);
        console.log("transactionStatus :"+transactionStatus);
        console.log("statusMessage :"+statusMessage);
        console.log("transactionTime :"+transactionTime);
        console.log("settlementTime :"+settlementTime);
        console.log("==================================");

        const payload: TransactionReq = {
            transaction: {
                transactionId:transactionId,
                statusCode:Number(statusCode),
                currency:currency,
                grossAmount:grossAmount,
                orderId:orderId,
                paymentType:paymentType,
                transactionStatus:transactionStatus,
                statusMessage:statusMessage,
                transactionTime:transactionTime,
                settlementTime:settlementTime

            },
            transactionItemList: transformed,
        };

        try {
            const result = await checkoutTransactionStatus(token, payload);
            console.log("Checkout success:", result?.data?.status);

            if(result?.data?.status == "settelment"){
                navigate("/kasir");
            }

        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Gagal menyimpan transaksi");
        }
    };

    type SnapResult = Record<string, unknown>;


    function parseSnapResult(result: SnapResult) {
        return {
            transactionId: typeof result.transaction_id === "string" ? result.transaction_id : "",
            statusCode: typeof result.status_code === "string" ? result.status_code : "",
            orderId: typeof result.order_id === "string" ? result.order_id : "",
            currency: typeof result.currency === "string" ? result.currency : "",
            grossAmount: typeof result.gross_amount === "string" ? result.gross_amount : "",
            paymentType: typeof result.payment_type === "string" ? result.payment_type : "",
            transactionStatus: typeof result.transaction_status === "string" ? result.transaction_status : "",
            statusMessage: typeof result.status_message === "string" ? result.status_message : "",
            transactionTime: typeof result.transaction_time === "string" ? result.transaction_time : "",
            settlementTime: typeof result.settlement_time === "string" ? result.settlement_time : "",
        };
    }

    // Pemanggilan Snap
    const handlePayment = () => {
        if (!window.snap || !transactionData.data?.token) {
            alert("Snap not loaded or token missing");
            return;
        }

        if (isSnapOpen) return;

        setIsSnapOpen(true);

        window.snap.embed(transactionData.data.token, {
            embedId: "snap-container",
            onSuccess: (result : SnapResult) => {
                console.log("Snap Success Result:", result);
                console.log("Snap current:", result.currency);
                const { transactionId, statusCode, orderId, currency, grossAmount, paymentType, transactionStatus, statusMessage, transactionTime, settlementTime } = parseSnapResult(result);
                handleAdToSTransaction(transactionId, statusCode, orderId, currency, grossAmount, paymentType, transactionStatus, statusMessage, transactionTime, settlementTime);
                setIsSnapOpen(false);
            },
            onPending: (result) => {
                console.log("onPending:", result);
                const { transactionId, statusCode, orderId, currency, grossAmount, paymentType, transactionStatus, statusMessage, transactionTime, settlementTime } = parseSnapResult(result);
                handleAdToSTransaction(transactionId, statusCode, orderId, currency, grossAmount, paymentType, transactionStatus, statusMessage, transactionTime, settlementTime);
                setIsSnapOpen(false);
            },
            onError: (result) => {
                console.log("onError:", result);
                const { transactionId, statusCode, orderId, currency, grossAmount, paymentType, transactionStatus, statusMessage, transactionTime, settlementTime } = parseSnapResult(result);
                handleAdToSTransaction(transactionId, statusCode, orderId, currency, grossAmount, paymentType, transactionStatus, statusMessage, transactionTime, settlementTime);
                setIsSnapOpen(false);
            },
            onClose: () => {
                alert("You closed the popup without finishing the payment.");
                setIsSnapOpen(false);
            },
        });
    };

    return (
        <div className="w-full xl:px-30 px-10 py-12">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Produk */}
                <Card className="xl:col-span-4 md:col-span-6 sm:col-span-12 shadow-xl rounded-xl p-8 dark:bg-[#010d2b]">
                    <h2 className="text-2xl font-bold border-b pb-3">Detail Item</h2>
                    <div className="space-y-5 max-h-[700px] overflow-y-auto">
                        {transactionData.data?.itemDetails.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-start border-b py-4 text-gray-700 dark:text-gray-200"
                        >
                            <div>
                                <h2 className=" ">{item.name}</h2>
                                <p className="text-sm">Qty: {item.quantity}</p>
                                
                            </div>
                            <div className="font-bold text-lg">
                            Rp {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                            </div>
                        </div>
                        ))}
                    </div>
                </Card>

                {/* Pembayaran */}
                <Card className="xl:col-span-8 md:col-span-6 sm:col-span-12 shadow-xl rounded-xl p-8 flex flex-col justify-between text-gray-700 dark:bg-[#010d2b] dark:text-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold mb-6 border-b pb-3">Payment</h2>

                        <div className="space-y-3 mb-4">
                            <label className="text-lg font-semibold">Customer Details</label>
                            <div className="space-y-1">
                                <p className="text-sm">{transactionData.data?.customerDetails.customerName}</p>
                            </div>
                        </div>

                        <div className="mb-4 border-t">
                            <label className="text-lg font-semibold">Items</label>
                            <ul className="divide-y max-h-64 overflow-y-auto ">
                                {transactionData.data?.itemDetails.map((item) => (
                                <li key={item.id} className="flex justify-between py-2">
                                    <div>
                                        <p className="font-medium">
                                            {item.name} (x{item.quantity})
                                        </p>
                                        <p className="text-sm">Rp {item.price}</p>
                                    </div>
                                    <div className="font-semibold">
                                    Rp {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                                    </div>
                                </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 pb-7 space-y-2 font-semibold border-t">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rp {Number(total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between ">
                                <span>PPN (10%)</span>
                                <span>Rp {(Number(total) * 0.1).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold pt-2  border-t">
                                <span>Total</span>
                                <span>Rp {(Number(total) * 1.1).toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            onClick={handlePayment}
                            className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white hover:text-white  rounded  font-semibold py-3 shadow transition duration-300"
                        >
                        Payment
                        </button>
                        <div className="mt-10">
                            <div className="w-full mx-auto" id="snap-container" ref={snapContainerRef}></div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PaymentComponent;