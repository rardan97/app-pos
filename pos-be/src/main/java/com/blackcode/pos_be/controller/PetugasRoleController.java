package com.blackcode.pos_be.controller;


import com.blackcode.pos_be.utils.ApiResponse;
import com.blackcode.pos_be.dto.petugas.PetugasRoleReq;
import com.blackcode.pos_be.dto.petugas.PetugasRoleRes;
import com.blackcode.pos_be.service.PetugasRoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/petugas/role")
public class PetugasRoleController {

    private final PetugasRoleService petugasRoleService;

    public PetugasRoleController(PetugasRoleService petugasRoleService) {
        this.petugasRoleService = petugasRoleService;
    }

    @GetMapping("/getRoleListAll")
    public ResponseEntity<ApiResponse<List<PetugasRoleRes>>> getRoleListAll(){
        List<PetugasRoleRes> roleListRes = petugasRoleService.getListAllRole();
        return ResponseEntity.ok(ApiResponse.success("Role retrieved successfully", 200, roleListRes));
    }

    @GetMapping("/getRoleFindById/{id}")
    public ResponseEntity<ApiResponse<PetugasRoleRes>> getRoleFindById(@PathVariable("id") Long id){
        PetugasRoleRes roleRes = petugasRoleService.getFindRoleById(id);
        return ResponseEntity.ok(ApiResponse.success("Role found", 200, roleRes));
    }

    @PostMapping("/addRole")
    public ResponseEntity<ApiResponse<PetugasRoleRes>> addRole(@RequestBody PetugasRoleReq petugasRoleReq){
        PetugasRoleRes roleRes = petugasRoleService.addRole(petugasRoleReq);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Role Created", 201, roleRes));
    }

    @PutMapping("/updateRole/{id}")
    public ResponseEntity<ApiResponse<PetugasRoleRes>> updateRole(@PathVariable("id") Long id, @RequestBody PetugasRoleReq petugasRoleReq){
        PetugasRoleRes roleRes = petugasRoleService.updateRole(id, petugasRoleReq);
        return ResponseEntity.ok(ApiResponse.success("Role Update", 200, roleRes));
    }

    @DeleteMapping("/deleteRoleById/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteRoleById(@PathVariable("id") Long id){
        Map<String, Object> rtn = petugasRoleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success("Role deleted successfully", 200, rtn));
    }
}