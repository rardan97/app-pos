package com.blackcode.pos_be.service;

import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req.CheckoutTransactionReq;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.CheckoutTransactionRes;
import com.midtrans.httpclient.error.MidtransError;
import org.springframework.stereotype.Service;

@Service
public interface CheckoutTransactionService {

    CheckoutTransactionRes createCheckoutTransaction(CheckoutTransactionReq checkoutTransactionReq) throws MidtransError;

}
