package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req.CheckoutTransactionReq;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req.DataProductTransaction;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.CheckoutTransactionRes;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.DataItemsDto;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.DataTotalDto;
import com.blackcode.pos_be.dto.transaction.TransactionDto;
import com.blackcode.pos_be.dto.transaction.TransactionItemDto;
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
import com.blackcode.pos_be.service.OrderTransactionService;
import com.midtrans.Config;
import com.midtrans.httpclient.SnapApi;
import com.midtrans.httpclient.error.MidtransError;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderTransactionServiceImpl implements OrderTransactionService {

    private final TransactionRepository transactionRepository;

    private final TransactionItemRepository transactionItemRepository;

    private final PetugasRepository petugasRepository;

    private final ProductRepository productRepository;


    @Value("${MIDTRANS_SERVER_KEY}")
    private String SERVER_KEY;

    private static final boolean IS_PRODUCTION = false;

    public OrderTransactionServiceImpl(TransactionRepository transactionRepository, TransactionItemRepository transactionItemRepository, PetugasRepository petugasRepository, ProductRepository productRepository) {
        this.transactionRepository = transactionRepository;
        this.transactionItemRepository = transactionItemRepository;
        this.petugasRepository = petugasRepository;
        this.productRepository = productRepository;
    }

    @Override
    public CheckoutTransactionRes createOrderTransaction(CheckoutTransactionReq checkoutTransactionReq) throws MidtransError {
        // Setup config
        Config config = Config.builder()
                .setServerKey(SERVER_KEY)
                .setIsProduction(IS_PRODUCTION)
                .build();

        // Generate order ID
        String orderId = "ORDER-" + UUID.randomUUID();

        // Calculate total
        int totalHarga = calculateTotal(checkoutTransactionReq.getDataProductTransactions());

        // Prepare params
        Map<String, Object> params = new HashMap<>();
        params.put("transaction_details", Map.of("order_id", orderId, "gross_amount", totalHarga));

        List<Map<String, Object>> itemDetails = new ArrayList<>();
        for (DataProductTransaction item : checkoutTransactionReq.getDataProductTransactions()) {
            itemDetails.add(Map.of(
                    "id", String.valueOf(item.getProductId()),
                    "price", Integer.parseInt(item.getProductHarga()),
                    "quantity", Integer.parseInt(item.getProductQty()),
                    "name", item.getProductNama()
            ));
        }
        params.put("item_details", itemDetails);

        Map<String, Object> customerDetails = Map.of("first_name", checkoutTransactionReq.getCustomerDto().getCustomerName());
        params.put("customer_details", customerDetails);

        params.put("credit_card", Map.of("secure", true));

        // Call Snap API
        JSONObject jsonObject = SnapApi.createTransaction(params, config);
        String tokenRtn = jsonObject.getString("token");

        // Build response DTO
        CheckoutTransactionRes res = new CheckoutTransactionRes();
        res.setToken(tokenRtn);
        res.setCustomerDetails(checkoutTransactionReq.getCustomerDto());
        res.setItemDetails(convertToDataItemsDto(checkoutTransactionReq.getDataProductTransactions()));

        DataTotalDto dataTotalDto = new DataTotalDto();
        dataTotalDto.setOrder_id(orderId);
        dataTotalDto.setTotal_amount(String.valueOf(totalHarga));
        res.setDataTotalTransaction(dataTotalDto);
        return res;
    }

    @Override
    public TransactionRes createStatusTransaction(TransactionReq transactionReq) {
        Transaction transaction = new Transaction();
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Petugas petugas = petugasRepository.findByPetugasUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Username not found"));

        TransactionRes transactionRes = new TransactionRes();
        TransactionDto transactionReqTemp = transactionReq.getTransaction();
        List<TransactionItemDto> transactionDetailListReq = transactionReq.getTransactionItemList();

        transaction.setTransactionId(transactionReqTemp.getTransactionId());
        transaction.setStatusCode(transactionReqTemp.getStatusCode());
        transaction.setGrossAmount(transactionReqTemp.getGrossAmount());
        transaction.setCurrency(transactionReqTemp.getCurrency());
        transaction.setOrderId(transactionReqTemp.getOrderId());
        transaction.setPaymentType(transactionReqTemp.getPaymentType());
        transaction.setTransactionStatus(transactionReqTemp.getTransactionStatus());
        transaction.setStatusMessage(transactionReqTemp.getStatusMessage());

        System.out.println("transactionTime: "+transactionReqTemp.getTransactionTime());

        DateTimeFormatter formatterDateTime = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime dateTransactionTime = LocalDateTime.parse(transactionReqTemp.getTransactionTime(), formatterDateTime);

        Date dateTimeTransaction = Date.from(dateTransactionTime.atZone(ZoneId.systemDefault()).toInstant());
//        Date dateTimeSettlementTime = Date.from(dateSettlementTime.atZone(ZoneId.systemDefault()).toInstant());
        transaction.setTransactionTime(dateTimeTransaction);
//        transaction.setSettlementTime(dateTimeSettlementTime);

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


    private static int calculateTotal(List<DataProductTransaction> items) {
        int total = 0;
        for (DataProductTransaction item : items) {
            int price = Integer.parseInt(item.getProductHarga());
            int qty = Integer.parseInt(item.getProductQty());
            total += price * qty;
        }
        return total;
    }


    private static List<DataItemsDto> convertToDataItemsDto(List<DataProductTransaction> items) {
        List<DataItemsDto> list = new ArrayList<>();
        for (DataProductTransaction item : items) {
            DataItemsDto dto = new DataItemsDto();
            dto.setId(String.valueOf(item.getProductId()));
            dto.setPrice(item.getProductHarga());
            dto.setQuantity(item.getProductQty());
            dto.setName(item.getProductNama());
            list.add(dto);
        }
        return list;
    }



}
