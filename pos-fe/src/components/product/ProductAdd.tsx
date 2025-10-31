import { useCallback, useEffect, useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { cn } from "@/lib/utils"
import { getListCategories } from "@/api/CategoryApi";
import { addProduct } from "@/api/ProductApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Input } from "../ui/input";
import type { AddProductDto } from "@/interface/Product.interface";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MdAdd } from "react-icons/md";

type OptionCategory = {
  value: string;
  label: string;
};


interface Errors {
    productName: string;
    productDescription: string;
    productPrice: string;
    productStock: string;
    productImage:string;
    productCategoryId: string;
}

export default function ProductAdd({ onSuccess }: { onSuccess: () => void }) {

    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [productName, setProductName] = useState<string>("");
    const [productDescription, setProductDescription] = useState<string>("");
    const [productPrice, setProductPrice] = useState<string>("");
    const [productStock, setProductStock] = useState<number>(0);
    const [productImage, setProductImage] = useState<File | string>("");
    const [productCategoryId, setProductCategoryId] = useState<string>("");
    const [optionsCategory, setOptionsCategory] = useState<OptionCategory[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const hasFetched = useRef(false);
    
    const [errors, setErrors] = useState<Errors>({
        productName: '',
        productDescription: '',
        productPrice: '',
        productStock: '',
        productImage:'',
        productCategoryId: '',
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setProductImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setProductImage("");
            setPreviewUrl("");
            setErrors({ ...errors, productImage: 'Please select a valid image file.' });
        }
    };

    const getListAllCategory = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        if (!token){
            return;
        }
        try {
            const response = await getListCategories(token);   
             if(response && response.data){
                const mapped = response.data.map((cat) => ({
                    value: cat.categoryId.toString(),
                    label: cat.categoryName,
                }));
                setOptionsCategory(mapped);
                console.log("Success processing data");
            }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, []);
    
    useEffect(() => {
        console.log(hasFetched);
        if (!hasFetched.current) {
            getListAllCategory();
            hasFetched.current = true; // Cegah request kedua
        }
    }, [getListAllCategory]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

   
    function validateForm(): boolean{
        console.log("proccess validation");
        let valid = true;
        const errorsCopy = {... errors}
        if(productName.trim()){
            errorsCopy.productName = '';
        }else{
            errorsCopy.productName = 'productName is required';
            valid = false;
        }
       
        if(productDescription.trim()){
            errorsCopy.productDescription = '';
        }else{
            errorsCopy.productDescription = 'productDescription is required';
            valid = false;
        }
        if(productPrice.trim()){
            errorsCopy.productPrice = '';
        }else{
            errorsCopy.productPrice = 'price is required';
            valid = false;
        }

        if (!Number.isFinite(productStock) || productStock < 0) {
            errorsCopy.productStock = "Stock harus berupa angka positif";
            valid = false;
        } else {
            errorsCopy.productStock = '';
        }
     
        if (productImage && (typeof productImage === 'string' || productImage instanceof File)) {
            errorsCopy.productImage = '';
        } else {
            errorsCopy.productImage = 'productImage is required';
            valid = false;
        }

        if(productCategoryId.trim()){
            errorsCopy.productCategoryId = '';
        }else{
            errorsCopy.productCategoryId = 'productCategoryId is required';
            valid = false;
        }
        setErrors(errorsCopy);
        return valid;
    }

    function resetForm() {
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductStock(0);
        setProductImage("");
        setPreviewUrl("");
        setProductCategoryId("");
        setErrorsAll("");
        setErrors({
            productName: '',
            productDescription: '',
            productPrice: '',
            productStock: '',
            productImage: '',
            productCategoryId: ''
        });
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
       
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setErrorsAll("Anda belum login. Silakan login terlebih dahulu.");
            setIsLoading(false);
            return;
        }
        if (validateForm()) {
            try {
                
                const newBooks: AddProductDto = {
                    productName,
                    productDescription,
                    productPrice,
                    productStock,
                    productImage,
                    productCategoryId
                };
            
                const result = await addProduct(token, newBooks);
                if(result){
                    console.log("success add data", result);
                    resetForm();
                    closeModal();
                    onSuccess();
                }else{
                    setErrorsAll("Gagal menambahkan produk. Silakan coba lagi.");
                }
            } catch (err) {
                console.error("Gagal menambahkan produk. Silakan coba lagi.", err);
                setErrorsAll("Gagal menambahkan produk. Silakan coba lagi.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <> 
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            <button  onClick={openModal} className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-500 text-white  hover:text-white   p-2 rounded">             
                <MdAdd className="text-white hover:text-white rounded cursor-pointer" size={20} />
                Add Product
            </button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]" >
           <DialogHeader>
             <DialogTitle>Add Product</DialogTitle>
             <DialogDescription>
               Make changes to your product here. Click save when you&apos;re
               done.
             </DialogDescription>
           </DialogHeader>
           <form className={cn("grid items-start gap-6")} onSubmit={handleSave}>
                {errorsAll && 
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Gagal menambahkan produk</AlertTitle>
                        <AlertDescription>
                        {errorsAll}
                        </AlertDescription>
                    </Alert>
                }
                <div className="grid gap-3">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input 
                        id="productName" 
                        type="text" 
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                    {errors.productName && <p className="text-red-500 text-sm">{errors.productName}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="productDescription">Product Deskripsi</Label>
                    <Input 
                        id="productDescription" 
                        type="text" 
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                    />
                    {errors.productDescription && <p className="text-red-500 text-sm">{errors.productDescription}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="productPrice">Product Price</Label>
                    <Input 
                        id="productPrice" 
                        type="text" 
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                    {errors.productPrice && <p className="text-red-500 text-sm">{errors.productPrice}</p>}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="productStock">Product Stock</Label>
                    <Input 
                        id="productStock" 
                        type="number" 
                        value={productStock}
                        onChange={(e) => {
                            const value = e.target.value;
                            const parsed = Number(value);
                            setProductStock(value === "" ? 0 : parsed);
                        }}
                    />
                    {errors.productStock && (
                        <p className="text-red-500 text-sm">{errors.productStock}</p>
                    )}
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <Select value={productCategoryId} onValueChange={(value) => setProductCategoryId(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {optionsCategory.map((category) => (
                                <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="productImage">Product Image</Label>
                    <Input 
                        id="productImage" 
                        type="file" 
                        onChange={handleImageChange} 
                    />
                    {previewUrl && (
                        <div className="my-2">
                            <img 
                            alt="Preview"
                            width={150}
                            src={previewUrl}
                            />
                        </div>
                    )}
                    {errors.productImage && <p className="text-red-500 text-sm">{errors.productImage}</p>}
                </div>
                <Button className="bg-green-600 hover:bg-green-500 text-white hover:text-white rounded" type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save changes"}
                </Button>
            </form>
         </DialogContent>
       </Dialog>  
        </>
    );
}