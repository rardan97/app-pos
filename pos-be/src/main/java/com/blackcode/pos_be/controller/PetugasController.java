package com.blackcode.pos_be.controller;

import com.blackcode.pos_be.dto.petugas.PetugasMessageRes;
import com.blackcode.pos_be.dto.petugas.PetugasReq;
import com.blackcode.pos_be.dto.petugas.PetugasRes;
import com.blackcode.pos_be.dto.petugas.PetugasSignUpReq;
import com.blackcode.pos_be.service.AuthPetugasService;
import com.blackcode.pos_be.service.PetugasService;
import com.blackcode.pos_be.utils.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/petugas/datapetugas")
public class PetugasController {


    private final PetugasService petugasService;


    public PetugasController(PetugasService petugasService) {
        this.petugasService = petugasService;
    }

    @GetMapping("/getPetugasListAll")
    public ResponseEntity<ApiResponse<List<PetugasRes>>> getPetugasListAll(){
        List<PetugasRes> petugasResList= petugasService.getAllPetugas();
        return ResponseEntity.ok(ApiResponse.success("Petugas retrieved successfully", 200, petugasResList));
    }

    @GetMapping("/getPetugasFindById/{id}")
    public ResponseEntity<ApiResponse<PetugasRes>> getPetugasFindById(@PathVariable("id") Long id){
        PetugasRes petugasRes = petugasService.getPetugasById(id);
        return ResponseEntity.ok(ApiResponse.success("Petugas found", 200, petugasRes));
    }

    @PostMapping("/addPetugas")
    public ResponseEntity<ApiResponse<PetugasRes>> addPetugas(@Valid @RequestBody PetugasReq petugasReq) {
        PetugasRes petugasRes = petugasService.addPetugas(petugasReq);
        return ResponseEntity.ok(ApiResponse.success("Success Add Petugas", 200, petugasRes));
    }


//    @PostMapping("/editPetugas/{id}")
//    public ResponseEntity<ApiResponse<?>> editPetugas(@Valid @RequestBody PetugasSignUpReq petugasSignUpReq) {
//        PetugasMessageRes petugasMessageRes = authPetugasService.signUp(petugasSignUpReq);
//        return ResponseEntity.ok(ApiResponse.success("Success Registration", 200, petugasMessageRes));
//    }
}
