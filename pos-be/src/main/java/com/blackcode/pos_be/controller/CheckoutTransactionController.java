package com.blackcode.pos_be.controller;


import com.blackcode.pos_be.common.dto.ApiResponse;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req.CheckoutTransactionReq;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.CheckoutTransactionRes;
import com.blackcode.pos_be.dto.transaction.TransactionReq;
import com.blackcode.pos_be.dto.transaction.TransactionRes;
import com.blackcode.pos_be.service.CheckoutTransactionService;
import com.blackcode.pos_be.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/petugas/checkout-transaction")
public class CheckoutTransactionController {

    private final CheckoutTransactionService checkoutTransactionService;

    private final TransactionService transactionService;

    public CheckoutTransactionController(CheckoutTransactionService checkoutTransactionService, TransactionService transactionService) {
        this.checkoutTransactionService = checkoutTransactionService;
        this.transactionService = transactionService;
    }

    @PostMapping("/create-checkout-transaction")
    public ResponseEntity<ApiResponse<CheckoutTransactionRes>> createTransactionToken(@RequestBody CheckoutTransactionReq checkoutTransactionReq) {
        try {
            CheckoutTransactionRes data = checkoutTransactionService.createCheckoutTransaction(checkoutTransactionReq);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Transaction Token created", 200, data));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error Proccess Checkout");
        }
    }

    @PostMapping("/create-transaction-status")
    public ResponseEntity<ApiResponse<TransactionRes>> createTransactionStatus(@RequestBody TransactionReq transactionReq){
        TransactionRes transactionRes = transactionService.addDataTransaction(transactionReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Transaction created", 200, transactionRes));
    }
}
