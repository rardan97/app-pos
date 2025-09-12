package com.blackcode.pos_be.model.petugas;


import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tb_petugas")
public class Petugas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long petugasId;

    private String petugasFullName;

    private String petugasEmail;

    private String petugasUsername;

    private String petugasPassword;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rolePetugasId")
    private PetugasRole petugasRole;

    public Petugas(String petugasFullName, String petugasEmail, String petugasUsername, String petugasPassword, PetugasRole petugasRole) {
        this.petugasFullName = petugasFullName;
        this.petugasEmail = petugasEmail;
        this.petugasUsername = petugasUsername;
        this.petugasPassword = petugasPassword;
        this.petugasRole = petugasRole;
    }
}
