package com.blackcode.pos_be.controller;


import com.blackcode.pos_be.common.dto.ApiResponse;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req.CheckoutTransactionReq;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.CheckoutTransactionRes;
import com.blackcode.pos_be.dto.transaction.TransactionReq;
import com.blackcode.pos_be.dto.transaction.TransactionRes;
import com.blackcode.pos_be.service.OrderTransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/petugas/order-transaction")
public class OrderTransactionController {

    private final OrderTransactionService orderTransactionService;

    public OrderTransactionController(OrderTransactionService orderTransactionService) {
        this.orderTransactionService = orderTransactionService;
    }


    @PostMapping("/createOrderTransaction")
    public ResponseEntity<ApiResponse<CheckoutTransactionRes>> createOrderTransaction(@RequestBody CheckoutTransactionReq checkoutTransactionReq) {
        try {
            CheckoutTransactionRes data = orderTransactionService.createOrderTransaction(checkoutTransactionReq);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Transaction Token created", 200, data));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error Proccess Checkout");
        }
    }

    @PostMapping("/createStatusTransaction")
    public ResponseEntity<ApiResponse<TransactionRes>> createStatusTransaction(@RequestBody TransactionReq transactionReq){
        TransactionRes transactionRes = orderTransactionService.createStatusTransaction(transactionReq);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transaction created", 200, transactionRes));
    }
}
