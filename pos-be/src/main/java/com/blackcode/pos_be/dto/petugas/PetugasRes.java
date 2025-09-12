package com.blackcode.pos_be.dto.petugas;

import com.blackcode.pos_be.model.petugas.PetugasRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PetugasRes {

    private Long petugasId;

    private String petugasFullName;

    private String petugasEmail;

    private String petugasUsername;

    private String petugasRole;
}
