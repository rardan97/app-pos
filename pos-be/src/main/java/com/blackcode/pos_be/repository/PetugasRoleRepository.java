package com.blackcode.pos_be.repository;

import com.blackcode.pos_be.model.petugas.PetugasRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetugasRoleRepository extends JpaRepository<PetugasRole, Long> {

    boolean existsByRoleName(String roleName);


}
