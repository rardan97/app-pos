package com.blackcode.pos_be.model;


import com.blackcode.pos_be.model.petugas.Petugas;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tb_transaction")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String Id;

    private String transactionId;

    private String token;

    private int statusCode;

    private String grossAmount;

    private String currency;

    private String orderId;

    private String paymentType;

    private String transactionStatus;

    private String fraudStatus;

    private String statusMessage;

    private String issuer;

    private String acquirer;

    private Date transactionTime;

    private Date settlementTime;

    private Date expiryTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "petugasId")
    private Petugas petugas;
}
