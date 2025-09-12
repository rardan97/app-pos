package com.blackcode.pos_be.service;

import com.blackcode.pos_be.dto.petugas.PetugasRoleReq;
import com.blackcode.pos_be.dto.petugas.PetugasRoleRes;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface PetugasRoleService {
    List<PetugasRoleRes> getListAllRole();

    PetugasRoleRes getFindRoleById(Long roleId);

    PetugasRoleRes addRole(PetugasRoleReq petugasRoleReq);

    PetugasRoleRes updateRole(Long roleId, PetugasRoleReq petugasRoleReq);

    Map<String, Object> deleteRole(Long roleId);
}
