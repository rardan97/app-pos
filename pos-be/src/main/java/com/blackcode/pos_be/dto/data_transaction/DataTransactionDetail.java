package com.blackcode.pos_be.dto.data_transaction;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DataTransactionDetail {

    private String Id;

    private String transactionId;

    private String grossAmount;

    private String currency;

    private String orderId;

    private String paymentType;

    private String transactionStatus;

    private String statusMessage;

    private Date transactionTime;

    private String petugasId;

    private Integer productQty;
}
