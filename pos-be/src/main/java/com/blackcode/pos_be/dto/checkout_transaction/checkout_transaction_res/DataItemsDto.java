package com.blackcode.pos_be.dto.checkout_transaction.checkout_transaction_res;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class DataItemsDto {
    private String id;
    private String price;
    private String quantity;
    private String name;
}