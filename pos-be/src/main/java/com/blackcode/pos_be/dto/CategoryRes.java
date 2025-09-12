package com.blackcode.pos_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CategoryRes {
    private Long categoryId;
    private String categoryName;
    private String categoryDescription;
}
