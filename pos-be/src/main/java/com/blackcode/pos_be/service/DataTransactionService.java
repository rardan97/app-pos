package com.blackcode.pos_be.service;


import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.dto.transaction.TransactionReq;
import com.blackcode.pos_be.dto.transaction.TransactionRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DataTransactionService {


    List<CategoryRes> getDataTransactionListAll();

    CategoryRes getDataTransactionById(Long categoryId);


}
