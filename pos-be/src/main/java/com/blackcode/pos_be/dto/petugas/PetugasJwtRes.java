package com.blackcode.pos_be.dto.petugas;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class PetugasJwtRes {
    private String token;
    private String type = "Bearer";
    private String refreshToken;
    private Long petugasId;
    private String petugasUsername;
    private List<String> petugasRoles;

    public PetugasJwtRes(String token, String refreshToken, Long petugasId, String petugasUsername, List<String> petugasRoles) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.petugasId = petugasId;
        this.petugasUsername = petugasUsername;
        this.petugasRoles = petugasRoles;
    }
}
