package com.blackcode.pos_be.controller;

import com.blackcode.pos_be.common.dto.ApiResponse;
import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.service.DataTransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/petugas/data-transaction")
public class DataTransaction {

    private final DataTransactionService transactionService;

    public DataTransaction(DataTransactionService transactionService) {
        this.transactionService = transactionService;
    }


    @GetMapping("/getDataTransactionListAll")
    public ResponseEntity<ApiResponse<List<CategoryRes>>> getDataTransactionListAll(){
        List<CategoryRes> categoryResList = transactionService.getDataTransactionListAll();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", 200, categoryResList));
    }

    @GetMapping("/getDataTransactionById/{id}")
    public ResponseEntity<ApiResponse<CategoryRes>> getDataTransactionById(@PathVariable("id") Long id){
        CategoryRes categoryRes = transactionService.getDataTransactionById(id);
        return ResponseEntity.ok(ApiResponse.success("Category found",200, categoryRes));
    }


}
