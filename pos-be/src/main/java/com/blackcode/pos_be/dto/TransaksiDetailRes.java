package com.blackcode.pos_be.dto;

import com.blackcode.pos_be.model.Product;
import com.blackcode.pos_be.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransaksiDetailRes {

    private Long transaksiDetailId;

    private Transaction transaksi;

    private Product product;

    private Integer jumlah;

    private String subTotalHarga;
}
