package com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DataProductTransaction {
    private Long productId;
    private String productNama;
    private String productHarga;
    private String productQty;
    private String productTotalHarga;
}
