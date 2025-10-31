package com.blackcode.pos_be.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PopularProductRes {

    private Long productId;

    private String productName;

    private BigDecimal productPrice;

    private int productTotal;
}
