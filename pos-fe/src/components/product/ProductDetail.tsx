import { useCallback, useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { cn } from "@/lib/utils"
import { getLoadImageProduct, getProductValueById } from "@/api/ProductApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { FaEye } from 'react-icons/fa6';


type ProductEditProps = {
    idProduct: number;
};


export default function ProductDetail({idProduct} : ProductEditProps) {
    const { isOpen, setIsOpen, openModal } = useModal();
    const [productName, setProductName] = useState<string>("");
    const [productDescription, setProductDescription] = useState<string>("");
    const [productPrice, setProductPrice] = useState<string>("");
    const [productStock, setProductStock] = useState<number>(0);
    const [productCategoryName, setProductCategoryName] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const getProduct = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        if (!token){
            return;
        }
        try {
            const response = await getProductValueById(token, idProduct);
            if(response && response.data){
                console.log("Success processing data");
                if (response.data.productImage) {
                    try {
                        const resImage = await getLoadImageProduct(token, response.data.productImage);
                        if (resImage) {
                            const url = URL.createObjectURL(resImage);
                            setPreviewUrl(url);
                            console.log("Data Image get : "+response.data.productImage);
                        }else{
                            console.warn("Gambar tidak ditemukan, menggunakan placeholder.");
                            setPreviewUrl("/placeholder.png");
                        }
                    } catch (error) {
                        console.error("Gagal load image:", error);
                        setPreviewUrl("/placeholder.png");
                    }
                } else {
                    setPreviewUrl("/placeholder.png");
                }
                console.log("Success processing data testttt");
                setProductName(response.data.productName);
                setProductDescription(response.data.productDescription);
                setProductPrice(response.data.productPrice);
                setProductStock(response.data.productStock);
                setProductCategoryName(response.data.productCategory.categoryName);
            }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, [idProduct]);
        
    useEffect(() => {
            if (isOpen) {
                getProduct();
            }
    }, [isOpen, getProduct]);


    useEffect(() => {
        return () => {
            if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);


    return (
        <> 
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>

                    
                        <button  onClick={openModal} className="flex items-center text-sm bg-gray-400 hover:bg-gray-500 text-white  hover:text-white dark:bg-[#50595f] dark:hover:bg-[#8d99a3] px-5 rounded">   
                        <FaEye
                        className="text-white hover:text-white rounded cursor-pointer"
                        size={16}
                        onClick={openModal}
                    />
                    </button>
                    
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" >
                    <DialogHeader>
                        <DialogTitle>Detail Product</DialogTitle>
                        <DialogDescription>
                            Make changes to your product here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className={cn("grid items-start gap-6")} >
                        
                        <Input 
                            id="productId" 
                            type="hidden" 
                            value={idProduct ?? ''}
                        />
                        <div className="grid gap-3">
                            <Label htmlFor="productName">Product Name</Label>
                            <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {productName}</div>
                            </div>
                        <div className="grid gap-3">
                            <Label htmlFor="productDescription">Product Deskripsi</Label>
                             <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {productDescription}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="productPrice">Product Price</Label>
                             <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {productPrice}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="productStock">Product Stock</Label>
                             <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {productStock}
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="category">Category</Label>
                             <div className="border border-input dark:bg-[#0a1122] dark:text-white rounded-md px-3 py-2 text-sm ">
                                {productCategoryName} 
                            </div>
                        <div className="grid gap-3">
                            <Label  htmlFor="productImage">Product Image</Label>
                            
                            {previewUrl && (
                                <div className="my-2">
                                    <img 
                                        alt="Preview"
                                        width={150}
                                        src={previewUrl}
                                    />
                                </div>
                            )}
                        </div>
                        
                    </div>
                    </div>
                </DialogContent>
            </Dialog>  
        </>
    );
}