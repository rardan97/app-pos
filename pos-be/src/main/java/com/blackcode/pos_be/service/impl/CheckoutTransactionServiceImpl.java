package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req.CheckoutTransactionReq;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req.DataProductTransaction;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.CheckoutTransactionRes;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.DataItemsDto;
import com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res.DataTotalDto;
import com.blackcode.pos_be.service.CheckoutTransactionService;
import com.midtrans.Config;
import com.midtrans.httpclient.SnapApi;
import com.midtrans.httpclient.error.MidtransError;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CheckoutTransactionServiceImpl implements CheckoutTransactionService {

    @Value("${MIDTRANS_SERVER_KEY}")
    private String SERVER_KEY;

    private static final boolean IS_PRODUCTION = false;

    @Override
    public CheckoutTransactionRes createCheckoutTransaction(CheckoutTransactionReq checkoutTransactionReq) throws MidtransError {
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
