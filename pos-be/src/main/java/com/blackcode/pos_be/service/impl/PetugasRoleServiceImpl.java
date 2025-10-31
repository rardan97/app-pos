package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.dto.petugas.PetugasRoleReq;
import com.blackcode.pos_be.dto.petugas.PetugasRoleRes;
import com.blackcode.pos_be.exception.DataNotFoundException;
import com.blackcode.pos_be.exception.DuplicateResourceException;
import com.blackcode.pos_be.model.Category;
import com.blackcode.pos_be.model.petugas.PetugasRole;
import com.blackcode.pos_be.repository.PetugasRoleRepository;
import com.blackcode.pos_be.service.PetugasRoleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PetugasRoleServiceImpl implements PetugasRoleService {

    private static final Logger logger = LoggerFactory.getLogger(PetugasRoleServiceImpl.class);

    private final PetugasRoleRepository petugasRoleRepository;

    public PetugasRoleServiceImpl(PetugasRoleRepository petugasRoleRepository) {
        this.petugasRoleRepository = petugasRoleRepository;
    }

    @Override
    public List<PetugasRoleRes> getListAllRole() {
        List<PetugasRole> petugasRoles = petugasRoleRepository.findAll();
        if(petugasRoles.isEmpty()){
            throw new DataNotFoundException("No Roles found");
        }

        return petugasRoles.stream()
                .map(this::mapToPetugasRoleRes).toList();
    }

    @Override
    public PetugasRoleRes getFindRoleById(Long roleId) {
        PetugasRole petugasRole = petugasRoleRepository.findById(roleId)
                .orElseThrow(() -> new DataNotFoundException("Role not found with id : "+ roleId));

        return mapToPetugasRoleRes(petugasRole);
    }

    @Override
    public PetugasRoleRes addRole(PetugasRoleReq petugasRoleReq) {
        if(petugasRoleRepository.existsByRoleName(petugasRoleReq.getRolePetugasName())){
            throw new DuplicateResourceException("Role with name already exists");
        }

        PetugasRole petugasRole = new PetugasRole();
        petugasRole.setRoleName(petugasRoleReq.getRolePetugasName());
        petugasRole.setRoleDesc(petugasRoleReq.getRolePetugasDesc());
        PetugasRole savePetugasRole = petugasRoleRepository.save(petugasRole);

        return mapToPetugasRoleRes(savePetugasRole);
    }

    @Override
    public PetugasRoleRes updateRole(Long roleId, PetugasRoleReq petugasRoleReq) {
        PetugasRole petugasRole = petugasRoleRepository.findById(roleId)
                .orElseThrow(() -> new DataNotFoundException("Role with ID "+ roleId + "Not Found"));

        petugasRole.setRoleName(petugasRoleReq.getRolePetugasName());
        petugasRole.setRoleDesc(petugasRoleReq.getRolePetugasDesc());
        PetugasRole updatePetugasRole = petugasRoleRepository.save(petugasRole);

        return mapToPetugasRoleRes(updatePetugasRole);
    }

    @Override
    public Map<String, Object> deleteRole(Long roleId) {
        PetugasRole petugasRole = petugasRoleRepository.findById(roleId)
                        .orElseThrow(() -> new DataNotFoundException("Role with ID "+roleId+ "Not Found"));
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleteRoleId", roleId);
        responseData.put("info", "The Role was removed from database.");
        return responseData;
    }

    private PetugasRoleRes mapToPetugasRoleRes(PetugasRole petugasRole) {
        PetugasRoleRes petugasRoleRes = new PetugasRoleRes();
        petugasRoleRes.setRolePetugasId(petugasRole.getRoleId());
        petugasRoleRes.setRolePetugasName(petugasRole.getRoleName());
        petugasRoleRes.setRolePetugasDesc(petugasRole.getRoleDesc());
        return petugasRoleRes;
    }
}
