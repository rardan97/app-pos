package com.blackcode.pos_be.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tb_transaction_item")
public class TransactionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String transactionItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transactionId")
    private Transaction transaction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId")
    private Product product;

    private Integer qty;

    private String subTotalAmount;
}
