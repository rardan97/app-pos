package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.CategoryRes;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataTransactionServiceImpl implements DataTransactionService {

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
    public List<CategoryRes> getDataTransactionListAll() {
        return List.of();
    }

    @Override
    public CategoryRes getDataTransactionById(Long categoryId) {
        return null;
    }
}
