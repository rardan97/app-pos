package com.blackcode.pos_be.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransaksiOrderReq {

    private String transaksiTotalHarga;

    private String petugas_id;

    private List<TransaksiDetailReq> transaksiDetail;

}
