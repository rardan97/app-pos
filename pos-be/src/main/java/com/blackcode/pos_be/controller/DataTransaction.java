package com.blackcode.pos_be.controller;

import com.blackcode.pos_be.utils.ApiResponse;
import com.blackcode.pos_be.dto.data_transaction.DataTransactionRes;
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
    public ResponseEntity<ApiResponse<List<DataTransactionRes>>> getDataTransactionListAll(){
        List<DataTransactionRes> transactionResList = transactionService.getDataTransactionListAll();
        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", 200, transactionResList));
    }

    @GetMapping("/getDataTransactionById/{id}")
    public ResponseEntity<ApiResponse<DataTransactionRes>> getDataTransactionById(@PathVariable("id") Long id){
        DataTransactionRes transactionRes = transactionService.getDataTransactionById(id);
        return ResponseEntity.ok(ApiResponse.success("Transaction found",200, transactionRes));
    }
}
