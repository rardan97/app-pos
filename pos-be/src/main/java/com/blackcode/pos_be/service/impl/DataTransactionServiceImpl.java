package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.dto.data_transaction.DataTransactionRes;
import com.blackcode.pos_be.dto.transaction.TransactionItemDto;
import com.blackcode.pos_be.dto.transaction.TransactionDto;
import com.blackcode.pos_be.dto.transaction.TransactionReq;
import com.blackcode.pos_be.dto.transaction.TransactionRes;
import com.blackcode.pos_be.exception.DataNotFoundException;
import com.blackcode.pos_be.model.Product;
import com.blackcode.pos_be.model.Transaction;
import com.blackcode.pos_be.model.TransactionItem;
import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.repository.PetugasRepository;
import com.blackcode.pos_be.repository.ProductRepository;
import com.blackcode.pos_be.repository.TransactionItemRepository;
import com.blackcode.pos_be.repository.TransactionRepository;
import com.blackcode.pos_be.service.DataTransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class DataTransactionServiceImpl implements DataTransactionService {

    private static final Logger logger = LoggerFactory.getLogger(DataTransactionServiceImpl.class);

    private final TransactionRepository transactionRepository;

    private final TransactionItemRepository transactionItemRepository;

    private final PetugasRepository petugasRepository;

    private final ProductRepository productRepository;

    public DataTransactionServiceImpl(TransactionRepository transactionRepository, TransactionItemRepository transactionItemRepository, PetugasRepository petugasRepository, ProductRepository productRepository) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.petugasRepository = petugasRepository;
        this.productRepository = productRepository;
    }


    @Override
    public List<DataTransactionRes> getDataTransactionListAll() {
        List<DataTransactionRes> transactionResList = new ArrayList<>();
        List<Transaction> transactionList = transactionRepository.findAll();
        for(Transaction transactionRow : transactionList){
            DataTransactionRes transactionRes = new DataTransactionRes();
            transactionRes.setId(transactionRow.getId());
            transactionRes.setTransactionId(transactionRow.getTransactionId());
            transactionRes.setGrossAmount(transactionRow.getGrossAmount());
            transactionRes.setCurrency(transactionRow.getCurrency());
            transactionRes.setOrderId(transactionRow.getOrderId());
            transactionRes.setPaymentType(transactionRow.getPaymentType());
            transactionRes.setTransactionStatus(transactionRow.getTransactionStatus());
            transactionRes.setStatusMessage(transactionRow.getStatusMessage());
            transactionRes.setTransactionTime(transactionRow.getTransactionTime());
            transactionRes.setPetugasId(transactionRes.getPetugasId());
            transactionResList.add(transactionRes);
        }
        return transactionResList;
    }

    @Override
    public DataTransactionRes getDataTransactionById(Long categoryId) {
        return null;
    }
}
