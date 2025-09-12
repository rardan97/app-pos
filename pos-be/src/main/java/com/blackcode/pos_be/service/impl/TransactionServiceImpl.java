package com.blackcode.pos_be.service.impl;

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
import com.blackcode.pos_be.service.TransactionService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    private final TransactionItemRepository transactionItemRepository;

    private final PetugasRepository petugasRepository;

    private final ProductRepository productRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, TransactionItemRepository transactionItemRepository, PetugasRepository petugasRepository, ProductRepository productRepository) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.petugasRepository = petugasRepository;
        this.productRepository = productRepository;
    }


    @Override
    public TransactionRes addDataTransaction(TransactionReq transactionReq) {
        Transaction transaction = new Transaction();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Petugas petugas = petugasRepository.findByPetugasUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Username not found"));

        TransactionRes transactionRes = new TransactionRes();
        TransactionDto transactionReqTemp = transactionReq.getTransaction();
        List<TransactionItemDto> transactionDetailListReq = transactionReq.getTransactionItemList();

        transaction.setTransactionId(transactionReqTemp.getTransactionId());
//        transaction.setToken(transactionReqTemp.getToken());
        transaction.setStatusCode(transactionReqTemp.getStatusCode());
        transaction.setGrossAmount(transactionReqTemp.getGrossAmount());
//        transaction.setCurrency(transactionReqTemp.getCurrency());
        transaction.setOrderId(transactionReqTemp.getOrderId());
//        transaction.setPaymentType(transactionReqTemp.getPaymentType());
//        transaction.setTransactionStatus(transactionReqTemp.getTransactionStatus());
//        transaction.setFraudStatus(transactionReqTemp.getFraudStatus());
//        transaction.setStatusMessage(transactionReqTemp.getStatusMessage());
//        transaction.setIssuer(transactionReqTemp.getIssuer());
//        transaction.setAcquirer(transactionReqTemp.getAcquirer());
//        transaction.setTransactionTime(transactionReqTemp.getTransactionTime());
//        transaction.setSettlementTime(transactionReqTemp.getSettlementTime());
//        transaction.setExpiryTime(transactionReqTemp.getExpiryTime());
        transaction.setPetugas(petugas);
        Transaction saveTransaction = transactionRepository.save(transaction);

        for (TransactionItemDto transactionDetailRow : transactionDetailListReq){
            Product product = productRepository.findById(Long.valueOf(transactionDetailRow.getProductId()))
                    .orElseThrow(() -> new DataNotFoundException("Data product not found"));
            TransactionItem transactionItem = new TransactionItem();
            transactionItem.setTransaction(saveTransaction);
            transactionItem.setProduct(product);
            transactionItem.setQty(transactionItem.getQty());
            transactionItem.setSubTotalAmount(transactionItem.getSubTotalAmount());
            transactionItemRepository.save(transactionItem);
        }

        transactionRes.setStatus(saveTransaction.getTransactionStatus());
        transactionRes.setTransactionId(saveTransaction.getTransactionId());
        transactionRes.setOrderId(saveTransaction.getOrderId());
        return transactionRes;
    }
}
