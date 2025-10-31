package com.blackcode.pos_be.dto.petugas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PetugasReq {

    @NotBlank
    @Size(min = 3, max = 20)
    private String petugasFullName;

    @NotBlank
    private String petugasEmail;

    @NotBlank
    @Size(min = 3, max = 20)
    private String petugasUsername;

    @NotBlank
    @Size(min = 3, max = 40)
    private String petugasPassword;

    private String petugasRoleId;
}
