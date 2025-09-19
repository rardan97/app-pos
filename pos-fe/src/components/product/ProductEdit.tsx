import { useCallback, useEffect, useRef, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { cn } from "@/lib/utils"
import { getListCategories } from "@/api/CategoryApi";
import { editProduct, getLoadImageProduct, getProductValueById } from "@/api/ProductApi";
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
import type { EditProductDto } from "@/interface/Product.interface";
import { Label } from "@radix-ui/react-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";



type OptionCategory = {
  value: string;
  label: string;
};


type ProductEditProps = {
    onSuccess: () => void;
    idProduct: number;
};

interface Errors {
    productName: string;
    productDescription: string;
    productPrice: string;
    productStock: number;
    productImage:string;
    productCategoryId: string;
}

export default function ProductEdit({onSuccess, idProduct} : ProductEditProps) {

    
    const { isOpen, setIsOpen, openModal, closeModal } = useModal();
    const [productId, setProductId] = useState<number>();  
    const [productName, setProductName] = useState<string>("");
    const [productDescription, setProductDescription] = useState<string>("");
    const [productPrice, setProductPrice] = useState<string>("");
    const [productStock, setProductStock] = useState<number>(0);
    const [productImage, setProductImage] = useState<File | string>("");
    const [productCategoryId, setProductCategoryId] = useState<string>("");

    const [optionsCategory, setOptionsCategory] = useState<OptionCategory[]>([]);

    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [errorsAll, setErrorsAll] = useState<string>("");
    const hasFetched = useRef(false);
    
    const [errors, setErrors] = useState<Errors>({
        productName: '',
        productDescription: '',
        productPrice: '',
        productStock: 0,
        productImage:'',
        productCategoryId: '',
        
    });

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
                                setProductImage(response.data.productImage);
                            }else{
                                console.warn("Gambar tidak ditemukan, menggunakan placeholder.");
                                setPreviewUrl("/placeholder.png");
                                setProductImage("");
                            }
                        } catch (error) {
                            console.error("Gagal load image:", error);
                            setPreviewUrl("/placeholder.png");
                            setProductImage("");
                        }
                    } else {
                        setPreviewUrl("/placeholder.png");
                        setProductImage(""); 
                    }

                    console.log("Success processing data testttt");
                    setProductId(response.data.productId);
                    setProductName(response.data.productName);
                    setProductDescription(response.data.productDescription);
                    setProductPrice(response.data.productPrice);
                    setProductStock(response.data.productStock);
                    setProductCategoryId(response.data.productCategory.categoryId.toString());
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


        if (productImage) {
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

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
       
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return;
        }
        if (validateForm()) {
            try {

                if (productId === undefined) {
                    throw new Error("categoryId is undefined");
                }

                console.log("edit image :"+productImage);

                const newProduct: EditProductDto = {
                    productId,
                    productName,
                    productDescription,
                    productPrice,
                    productStock,
                    productImage,
                    productCategoryId
                };
            
                const result = await editProduct(token, productId, newProduct);
                if(result){
                    console.log("success add data", result);
                    
                    setProductName("");
                    setProductDescription("");
                    setProductPrice("");
                    setProductStock(0);
                    setProductImage("");
                    setProductCategoryId("");
                    setErrorsAll("");
                    closeModal();
                    onSuccess();
                }else{
                    setErrorsAll("Login gagal. Cek email/password.");
                }
            } catch (err) {
                console.error("Gagal login", err);
                setErrorsAll("Login gagal. Cek email/password.");
            }
        }

        console.log("Saving changes...");
        closeModal();
    };

    return (
        <> 
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
           <Button variant="outline" onClick={openModal}>Edit Product</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]" >
           <DialogHeader>
             <DialogTitle>Edit Product</DialogTitle>
             <DialogDescription>
               Make changes to your product here. Click save when you&apos;re
               done.
             </DialogDescription>
           </DialogHeader>
           <form className={cn("grid items-start gap-6")} onSubmit={handleSave}>
                {errorsAll && 
                    <Alert variant="destructive">
                        <AlertCircleIcon />
                        <AlertTitle>Unable to process your payment.</AlertTitle>
                        <AlertDescription>
                        <p>Please verify your billing information and try again.</p>
                        {errorsAll}
                        </AlertDescription>
                    </Alert>
                }

                <Input 
                    id="productId" 
                    type="hidden" 
                    value={productId ?? ''}
                    onChange={(e) => setProductId(Number(e.target.value))}
                />
            
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
                        onChange={(e) => setProductStock(Number(e.target.value))}
                    />
                    {/* {errors.productStock && <p className="text-red-500 text-sm">{errors.productStock}</p>} */}
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="email">Category</Label>
                    <Select
                     value={productCategoryId}
                     onValueChange={(value) => setProductCategoryId(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            {optionsCategory.map((category) => (
                                <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {/* <div className="grid gap-3">
                    <Label htmlFor="productCategory">Product Category</Label>
                    <Input id="productCategory" type="text" onChange={(e) => setProductCategoryId(e.target.value)}/>
                    {errors.productCategoryId && <p className="text-red-500 text-sm">{errors.productCategoryId}</p>}
                </div> */}

                <div className="grid gap-3">
                    <Label  htmlFor="productImage">Product Image</Label>
                    <Input 
                        id="picture" 
                        type="file" 
                        onChange={handleImageChange} 
                    />
                        
                    {productImage && (
                        <div className='my-2'>
                            <img 
                                alt='not found'
                                width={"150"}
                                src={previewUrl}
                            />
                        </div>
                    )}
                    {errors.productImage && <div className='invalid-feedback'>{errors.productImage}</div>}
                </div>
                <Button type="submit">Save changes</Button>
            </form>
         </DialogContent>
       </Dialog>  
        </>
    );
}