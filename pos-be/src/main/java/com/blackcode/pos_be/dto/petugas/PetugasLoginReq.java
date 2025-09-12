package com.blackcode.pos_be.dto.petugas;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetugasLoginReq {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

}
