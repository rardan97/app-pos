package com.blackcode.pos_be.model.petugas;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "tb_refresh_token_petugas", uniqueConstraints = @UniqueConstraint(columnNames = "petugasId"))
public class PetugasRefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "petugas_id", referencedColumnName = "petugasId")
    private Petugas petugas;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;
}
