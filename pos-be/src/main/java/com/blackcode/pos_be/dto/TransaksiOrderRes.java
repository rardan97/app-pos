package com.blackcode.pos_be.dto;

import com.blackcode.pos_be.model.petugas.Petugas;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransaksiOrderRes {

    private Long transaksiId;

    private Date transaksiDate;

    private String transaksiTotalHarga;

    private Petugas petugas;

    private List<TransaksiDetailRes> transaksiDetail;
}
