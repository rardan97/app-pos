package com.blackcode.pos_be.repository;

import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.model.petugas.PetugasRefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetugasRefreshTokenRepository extends JpaRepository<PetugasRefreshToken, Long> {
    Optional<PetugasRefreshToken> findByToken(String token);
    @Query("SELECT rt FROM PetugasRefreshToken rt WHERE rt.petugas.id = :petugasId")
    Optional<PetugasRefreshToken> findByPetugasId(Long petugasId);
    @Modifying
    int deleteByPetugas(Petugas petugas);
}
