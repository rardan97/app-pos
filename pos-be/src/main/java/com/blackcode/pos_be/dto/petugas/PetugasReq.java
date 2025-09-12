package com.blackcode.pos_be.dto.petugas;


import com.blackcode.pos_be.model.petugas.PetugasRole;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PetugasReq {

    private String petugasFullName;

    private String petugasEmail;

    private String petugasUsername;

    private String petugasPassword;

    private PetugasRole petugasRole;


}
