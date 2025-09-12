package com.blackcode.pos_be.dto.petugas;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetugasTokenRefreshReq {
    @NotBlank
    private String refreshToken;
}
