package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.CategoryReq;
import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.exception.DataNotFoundException;
import com.blackcode.pos_be.exception.DuplicateResourceException;
import com.blackcode.pos_be.model.Category;
import com.blackcode.pos_be.repository.CategoryRepository;
import com.blackcode.pos_be.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryRes> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        if(categories.isEmpty()){
            throw new DataNotFoundException("No categories found");
        }
        return categories.stream()
                .map(this::mapToCategoryRes).toList();
    }

    @Override
    public CategoryRes getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataNotFoundException("Category not found with id: "+categoryId));
        return mapToCategoryRes(category);
    }

    @Override
    public CategoryRes createCategory(CategoryReq categoryReq) {
        if (categoryRepository.existsByCategoryName(categoryReq.getCategoryName())) {
            throw new DuplicateResourceException("Category with name already exists");
        }

        Category category = new Category();
        category.setCategoryName(categoryReq.getCategoryName());
        category.setCategoryDescription(categoryReq.getCategoryDescription());
        Category savedCategory = categoryRepository.save(category);
        return mapToCategoryRes(savedCategory);
    }

    @Override
    public CategoryRes updateCategory(Long categoryId, CategoryReq categoryReq) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new DataNotFoundException("Category with ID "+categoryId + "Not Found"));

        category.setCategoryName(categoryReq.getCategoryName());
        category.setCategoryDescription(categoryReq.getCategoryDescription());
        Category updatedCategory = categoryRepository.save(category);
        return mapToCategoryRes(updatedCategory);
    }

    @Override
    public Map<String, Object> deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new DataNotFoundException("Category with ID "+categoryId + "Not Found"));
        categoryRepository.deleteById(categoryId);
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deletedCategoryId", categoryId);
        responseData.put("info", "The category was removed from the database.");
        return responseData;
    }

    private CategoryRes mapToCategoryRes(Category category) {
        CategoryRes categoryRes = new CategoryRes();
        categoryRes.setCategoryId(category.getCategoryId());
        categoryRes.setCategoryName(category.getCategoryName());
        categoryRes.setCategoryDescription(category.getCategoryDescription());
        return categoryRes;
    }
}
