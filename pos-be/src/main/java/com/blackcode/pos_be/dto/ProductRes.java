package com.blackcode.pos_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProductRes {

    private Long productId;

    private String productName;

    private String productDescription;

    private String productPrice;

    private Integer productStock;

    private String productImage;

    private CategoryRes productCategory;
}
