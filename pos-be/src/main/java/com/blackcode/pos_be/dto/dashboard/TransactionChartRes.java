package com.blackcode.pos_be.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TransactionChartRes {

    private int transactionFood;

    private int transactionDrink;

    private Date transactionDate;

}
