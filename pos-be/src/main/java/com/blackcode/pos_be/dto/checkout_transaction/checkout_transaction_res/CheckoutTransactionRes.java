package com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res;

import com.blackcode.pos_be.dto.checkout_transaction.CustomerDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class CheckoutTransactionRes {

    private CustomerDto customerDetails;
    private List<DataItemsDto> itemDetails;
    private DataTotalDto dataTotalTransaction;
    private String token;


}
