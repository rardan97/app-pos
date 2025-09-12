package com.blackcode.pos_be.service;

import com.blackcode.pos_be.dto.TransaksiOrderReq;
import com.blackcode.pos_be.dto.TransaksiOrderRes;
import com.blackcode.pos_be.dto.transaction.TransactionReq;
import com.blackcode.pos_be.dto.transaction.TransactionRes;
import org.springframework.stereotype.Service;

@Service
public interface TransactionService {

    TransactionRes addDataTransaction(TransactionReq transactionReq);



}
