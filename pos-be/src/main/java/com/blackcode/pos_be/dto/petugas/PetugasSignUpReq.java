package com.blackcode.pos_be.dto.petugas;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PetugasSignUpReq {

    @NotBlank
    @Size(min = 3, max = 20)
    private String fullName;

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(min = 3, max = 40)
    private String password;

    @NotBlank
    private String email;

    private String role;
}
