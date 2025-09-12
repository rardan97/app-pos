package com.blackcode.pos_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransaksiDetailReq {

    private String productId;

    private Integer jumlah;

    private String subTotalHarga;

}
