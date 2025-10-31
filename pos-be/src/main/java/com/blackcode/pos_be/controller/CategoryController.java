package com.blackcode.pos_be.controller;

import com.blackcode.pos_be.utils.ApiResponse;
import com.blackcode.pos_be.dto.CategoryReq;
import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/petugas/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/getCategoryListAll")
    public ResponseEntity<ApiResponse<List<CategoryRes>>> getCategoryListAll(){
        List<CategoryRes> categoryResList = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", 200, categoryResList));
    }

    @GetMapping("/getCategoryFindById/{id}")
    public ResponseEntity<ApiResponse<CategoryRes>> getCategoryFindById(@PathVariable("id") Long id){
        CategoryRes categoryRes = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category found",200, categoryRes));
    }

    @PostMapping("/addCategory")
    public ResponseEntity<ApiResponse<CategoryRes>> addCategory(@RequestBody CategoryReq categoryReq){
        CategoryRes categoryRes = categoryService.createCategory(categoryReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Category created", 201, categoryRes));
    }

    @PutMapping("/updateCategory/{id}")
    public ResponseEntity<ApiResponse<CategoryRes>> updateCategory(@PathVariable("id") Long id, @RequestBody CategoryReq categoryReq){
        CategoryRes categoryRes = categoryService.updateCategory(id, categoryReq);
        return ResponseEntity.ok(ApiResponse.success("Category Update", 200, categoryRes));
    }

    @DeleteMapping("/deleteCategoryById/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteCategoryById(@PathVariable("id") Long id){
        Map<String, Object> rtn = categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", 200, rtn));
    }
}