package com.blackcode.pos_be.repository;


import com.blackcode.pos_be.model.petugas.Petugas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PetugasRepository extends JpaRepository<Petugas, Long> {
    Optional<Petugas> findByPetugasUsername(String petugasUsername);
    Boolean existsByPetugasUsername(String petugasUsername);
}
