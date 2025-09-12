package com.blackcode.pos_be.controller;

import com.blackcode.pos_be.dto.petugas.PetugasRes;
import com.blackcode.pos_be.service.PetugasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/petugas/datapetugas")
public class PetugasController {

    @Autowired
    private PetugasService petugasService;


    @GetMapping("/getPetugasListAll")
    public ResponseEntity<List<PetugasRes>> getPetugasListAll(){
        List<PetugasRes> categoryResList= petugasService.getAllPetugas();
        System.out.println(categoryResList.size());
        return ResponseEntity.ok(categoryResList);
    }

    @GetMapping("/getPetugasFindById/{id}")
    public ResponseEntity<PetugasRes> getPetugasFindById(@PathVariable("id") Long id){
        PetugasRes categoryRes = petugasService.getPetugasById(id);
        return ResponseEntity.ok(categoryRes);
    }




    
}
