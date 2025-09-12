import { useCallback, useEffect, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CardAction, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { Category } from "@/interface/Category.interface";
import { getListCategories } from "@/api/CategoryApi";
import CategoryAdd from "./CategoryAdd";
import CategoryEdit from "./CategoryEdit";
import CategoryDelete from "./CategoryDelete";


export default function CategoryList() {
    const hasFetched = useRef(false);
    const [categorys, setCategorys] = useState<Category[]>([]);

    const getListAllUser = useCallback(async (): Promise<void> => {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        if (!token){
            return;
        }
        try {
            const response = await getListCategories(token);
            if(response && response.data){
                console.log("Success processing data");
                setCategorys(response.data);
            }
        } catch (error) {
            console.log("Failed processing data", error);
            throw error;
        }
    }, []);

    useEffect(() => {
        console.log(hasFetched);
        if (!hasFetched.current) {
            getListAllUser();
            hasFetched.current = true; // Cegah request kedua
        }
    }, [getListAllUser]);

    return (
        <>
            <div>
                <CardHeader>
                    <CardTitle>Data Category</CardTitle>
                    <CardAction><CategoryAdd onSuccess={getListAllUser}/></CardAction>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Category ID</TableHead>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Category Desk</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categorys
                                .filter((category) => category.categoryId !== null && category.categoryId !== undefined)
                                .map((category) => (
                            <TableRow key={category.categoryId}>
                            <TableCell className="font-medium">{category.categoryId}</TableCell>
                            <TableCell>{category.categoryName}</TableCell>
                            <TableCell>{category.categoryDescription}</TableCell>
                            <TableCell className="text-right ">
                                <CategoryEdit onSuccess={getListAllUser} idCat={category.categoryId as number} />
                                <CategoryDelete onSuccess={getListAllUser} idCat={category.categoryId as number} />
                            </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </div>
        </>
    );
}