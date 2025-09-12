package com.blackcode.pos_be.service;

import com.blackcode.pos_be.dto.CategoryReq;
import com.blackcode.pos_be.dto.CategoryRes;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface CategoryService {
    List<CategoryRes> getAllCategories();

    CategoryRes getCategoryById(Long categoryId);

    CategoryRes createCategory(CategoryReq category);

    CategoryRes updateCategory(Long categoryId, CategoryReq category);

    Map<String, Object> deleteCategory(Long categoryId);
}
