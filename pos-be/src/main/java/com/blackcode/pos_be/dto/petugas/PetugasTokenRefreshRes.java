package com.blackcode.pos_be.dto.petugas;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetugasTokenRefreshRes {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";

    public PetugasTokenRefreshRes(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
