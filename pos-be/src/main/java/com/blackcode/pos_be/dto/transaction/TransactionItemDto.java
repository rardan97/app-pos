package com.blackcode.pos_be.dto.transaction;

import com.blackcode.pos_be.model.Product;
import com.blackcode.pos_be.model.Transaction;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransactionItemDto {

    private String productId;

    private String productHarga;

    private Integer productQty;

    private String subTotalAmount;

}
