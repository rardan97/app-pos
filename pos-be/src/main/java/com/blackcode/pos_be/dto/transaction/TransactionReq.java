package com.blackcode.pos_be.dto.transaction;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransactionReq {

    private TransactionDto transaction;

    private List<TransactionItemDto> transactionItemList;

}
