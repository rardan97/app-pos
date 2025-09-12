package com.blackcode.pos_be.dto.transaction;

import com.blackcode.pos_be.model.petugas.Petugas;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransactionDto {

    private String transactionId;

    private int statusCode;

    private String grossAmount;

    private String orderId;

}
