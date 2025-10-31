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
public class SectionCardRes {

    private String title;

    private BigDecimal total;

    private String desc;

}
