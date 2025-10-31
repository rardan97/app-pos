import { Button } from "@/components/ui/button";
import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/useModal";
import { useTransaction } from "@/context/TransactionContext";
import { checkoutTransaction } from "@/api/KasirApi";
import type { CheckoutTransactionReq } from "@/interface/CheckoutTransaction.interface";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
}

type BuyComponentProps = {
    disabled?: boolean;
    className?: string;
    dataCart: CartItem[];
};

export default function CheckoutComponent({disabled, className, dataCart, }: BuyComponentProps) {
    
    const { setTransactionData } = useTransaction();
    const navigate = useNavigate();
    const { isOpen, setIsOpen, openModal} = useModal();
    const [customerName, setCustomerName] = useState("");
    const [nameError, setNameError] = useState("");

    const handleOpenModal = () => {
        openModal();
        setCustomerName("");
        setNameError("");
    };

    const total = dataCart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const handleProceedToCheckout = async () => {
        if (!customerName.trim()) {
            setNameError("Nama customer wajib diisi.");
            return;
        }
        
        const token = localStorage.getItem("accessToken");
        if (!token) return;

         const transformed = dataCart.map((item) => ({
            productId: item.id,
            productNama: item.name,
            productHarga: String(item.price),
            productQty: String(item.qty),
            productTotalHarga: String(item.price * item.qty),
        }));

        const payload: CheckoutTransactionReq = {
            customerDto: {
                customerName:customerName,
            },
            dataProductTransactions: transformed
        };

        try {
            const result = await checkoutTransaction(token, payload);
            setTransactionData(result);
            console.log("data result checkout: ", result.data?.token);
            // onSuccess();
            navigate("/payment");
        } catch (error) {
            console.error("Checkout failed:", error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={handleOpenModal}
                    className={className}
                    disabled={disabled}
                    >
                    Checkout
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">Pembelian</DialogTitle>
                    <DialogDescription>
                        Periksa kembali item pesananmu sebelum membayar.
                    </DialogDescription>
                </DialogHeader>

                {/* Input nama customer */}
                <div className="grid gap-2">
                    <Label htmlFor="customerName">Nama Customer</Label>
                    <Input
                        id="customerName"
                        placeholder="Nama Pembeli"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    {nameError && <p className="text-sm text-red-500">{nameError}</p>}
                </div>

                {/* List item belanja */}
                <div className="grid gap-4 max-h-[250px] overflow-y-auto mt-4 pr-2">
                    {dataCart.length === 0 ? (
                        <p className="text-muted-foreground">Keranjang kosong.</p>
                    ) : (
                        dataCart.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b pb-2"
                        >
                            <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {item.qty} x Rp{item.price.toLocaleString()}
                            </p>
                            </div>
                            <p className="font-semibold text-right">
                            Rp{(item.price * item.qty).toLocaleString()}
                            </p>
                        </div>
                        ))
                    )}
                </div>
                <div className="mt-4 border-t pt-4 flex justify-between items-center text-lg font-semibold">
                    <span>Total:</span>
                    <span>Rp{total.toLocaleString()}</span>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button
                        onClick={handleProceedToCheckout}
                        disabled={dataCart.length === 0}
                        className="bg-green-600 hover:bg-green-500 text-white"
                    >
                        Proccess Payment
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}