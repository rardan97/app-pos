package com.blackcode.pos_be.repository;

import com.blackcode.pos_be.model.petugas.PetugasToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetugasTokenRepository extends JpaRepository<PetugasToken, Long> {
    Optional<PetugasToken> findByToken(String token);
    Optional<PetugasToken> findByPetugasId(Long petugasId);
    Optional<PetugasToken> findByPetugasIdAndToken(Long petugasId, String token);
    void deleteByToken(String token);
}
