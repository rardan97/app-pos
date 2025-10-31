package com.blackcode.pos_be.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PopularTypeOrderRes {

    private long typeOrderId;

    private String typeOrderName;

    private int typeOrderTotal;

}
