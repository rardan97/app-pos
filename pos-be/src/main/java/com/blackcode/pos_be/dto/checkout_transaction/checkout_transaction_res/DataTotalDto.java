package com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DataTotalDto {
    private String order_id;
    private String total_amount;
}