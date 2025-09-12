package com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DataTransaksi {
    private Integer transaksiId;

    private String transaksiKode;

    private String transaksiTotal;
}
