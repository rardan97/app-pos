package com.blackcode.pos_be.service;


import com.blackcode.pos_be.dto.petugas.PetugasReq;
import com.blackcode.pos_be.dto.petugas.PetugasRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PetugasService {

    List<PetugasRes> getAllPetugas();

    PetugasRes getPetugasById(Long petugasId);

    PetugasRes addPetugas(PetugasReq petugasReq);

    PetugasRes editPetugas(Long petugasId, PetugasReq petugasReq);
}
