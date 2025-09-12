import type { Category } from "./Category.interface";

export interface Product {
    productId: number;
    productName: string;
    productDescription: string;
    productPrice: string;
    productStock: number;
    productImage: File | string;
    productCategory: Category;
}

export interface AddProductDto {
    productName: string;
    productDescription: string;
    productPrice: string;
    productStock: number;
    productImage: File | string;
    productCategoryId: string;
}

export interface EditProductDto{
    productId: number;
    productName: string;
    productDescription: string;
    productPrice: string;
    productStock: number;
    productImage: File | string;
    productCategoryId: string;
}