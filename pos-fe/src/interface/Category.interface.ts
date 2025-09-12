export interface Category {
  categoryId: number;
  categoryName: string;
  categoryDescription?: string | null;
}

export interface CategoryDto {
  categoryName: string;
  categoryDescription?: string;
}

