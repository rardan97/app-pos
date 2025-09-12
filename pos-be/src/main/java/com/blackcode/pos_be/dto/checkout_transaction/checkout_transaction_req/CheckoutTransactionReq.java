package com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_req;

import com.blackcode.pos_be.dto.checkout_transaction.CustomerDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CheckoutTransactionReq {

    private CustomerDto customerDto;

    private List<DataProductTransaction> dataProductTransactions;
}
