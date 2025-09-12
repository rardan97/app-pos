package com.blackcode.pos_be.dto;

import com.blackcode.pos_be.model.Category;
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
public class ProductReq {

    private String productName;

    private String productDescription;

    private String productPrice;

    private Integer productStock;

    private String productImage;

    private String productCategoryId;


}
