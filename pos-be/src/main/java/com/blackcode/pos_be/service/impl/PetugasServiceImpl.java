package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.dto.petugas.PetugasReq;
import com.blackcode.pos_be.dto.petugas.PetugasRes;
import com.blackcode.pos_be.model.Category;
import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.repository.CategoryRepository;
import com.blackcode.pos_be.repository.PetugasRepository;
import com.blackcode.pos_be.service.PetugasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetugasServiceImpl implements PetugasService {

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    private PetugasRepository petugasRepository;

    @Override
    public List<PetugasRes> getAllPetugas() {
        System.out.println("Data category List");
        List<Petugas> petugasList = petugasRepository.findAll();
        return petugasList.stream()
                .map(c -> new PetugasRes(
                        c.getPetugasId(),
                        c.getPetugasFullName(),
                        c.getPetugasEmail(),
                        c.getPetugasUsername(),
                        c.getPetugasRole().getRoleName()
                )).toList();
    }

    @Override
    public PetugasRes getPetugasById(Long petugasId) {
        Optional<Petugas> petugas = petugasRepository.findById(petugasId);
        PetugasRes petugasRes = null;
        if(petugas.isPresent()){
            petugasRes = new PetugasRes();
            petugasRes.setPetugasId(petugas.get().getPetugasId());
            petugasRes.setPetugasFullName(petugas.get().getPetugasFullName());
            petugasRes.setPetugasEmail(petugas.get().getPetugasEmail());
            petugasRes.setPetugasUsername(petugas.get().getPetugasUsername());
            petugasRes.setPetugasRole(petugas.get().getPetugasRole().getRoleName());
            return petugasRes;
        }
        return null;
    }

    @Override
    public PetugasRes addPetugas(PetugasReq petugasReq) {
        Petugas petugas = new Petugas(
                petugasReq.getPetugasFullName(),
                petugasReq.getPetugasEmail(),
                petugasReq.getPetugasUsername(),
                encoder.encode(petugasReq.getPetugasPassword()),
                petugasReq.getPetugasRole()
        );

        petugasRepository.save(petugas);
        return null;
    }
}
