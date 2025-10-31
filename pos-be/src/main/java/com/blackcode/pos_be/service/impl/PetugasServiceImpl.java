package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.dto.petugas.PetugasMessageRes;
import com.blackcode.pos_be.dto.petugas.PetugasReq;
import com.blackcode.pos_be.dto.petugas.PetugasRes;
import com.blackcode.pos_be.dto.petugas.PetugasRoleRes;
import com.blackcode.pos_be.exception.DataNotFoundException;
import com.blackcode.pos_be.exception.RoleNotFoundException;
import com.blackcode.pos_be.exception.UsernameAlreadyExistsException;
import com.blackcode.pos_be.model.Category;
import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.model.petugas.PetugasRole;
import com.blackcode.pos_be.repository.CategoryRepository;
import com.blackcode.pos_be.repository.PetugasRepository;
import com.blackcode.pos_be.repository.PetugasRoleRepository;
import com.blackcode.pos_be.service.PetugasService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetugasServiceImpl implements PetugasService {

    private static final Logger logger = LoggerFactory.getLogger(PetugasRoleServiceImpl.class);


    private final PasswordEncoder encoder;

    private final PetugasRepository petugasRepository;

    private final PetugasRoleRepository petugasRoleRepository;

    public PetugasServiceImpl(PasswordEncoder encoder, PetugasRepository petugasRepository, PetugasRoleRepository petugasRoleRepository) {
        this.encoder = encoder;
        this.petugasRepository = petugasRepository;
        this.petugasRoleRepository = petugasRoleRepository;
    }

    @Override
    public List<PetugasRes> getAllPetugas() {
        System.out.println("Data category List");
        List<Petugas> petugasList = petugasRepository.findAll();
        return petugasList.stream()
                .map(this::mapToPetugasRes).toList();
    }

    @Override
    public PetugasRes getPetugasById(Long petugasId) {
        Petugas petugas = petugasRepository.findById(petugasId)
                .orElseThrow(() -> new DataNotFoundException("Petugas not found with id: "+petugasId));

        return mapToPetugasRes(petugas);
    }

    @Override
    public PetugasRes addPetugas(PetugasReq petugasReq) {
        System.out.println("username : "+petugasReq.getPetugasUsername());
        if(petugasRepository.existsByPetugasUsername(petugasReq.getPetugasUsername())){
            throw new UsernameAlreadyExistsException("Username is already taken!");
        }
        long roleId = Long.parseLong(petugasReq.getPetugasRoleId());
        PetugasRole roleData = petugasRoleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with id:" + roleId));

        Petugas petugas = new Petugas(
                petugasReq.getPetugasFullName(),
                petugasReq.getPetugasEmail(),
                petugasReq.getPetugasUsername(),
                encoder.encode(petugasReq.getPetugasPassword()),
                roleData);

        Petugas savePetugas = petugasRepository.save(petugas);

        return mapToPetugasRes(savePetugas);
    }

    @Override
    public PetugasRes editPetugas(Long petugasId, PetugasReq petugasReq) {


        return null;
    }

    private PetugasRes mapToPetugasRes(Petugas petugas) {
        PetugasRes petugasRes = new PetugasRes();
        petugasRes.setPetugasId(petugas.getPetugasId());
        petugasRes.setPetugasFullName(petugas.getPetugasFullName());
        petugasRes.setPetugasEmail(petugas.getPetugasEmail());
        petugasRes.setPetugasUsername(petugas.getPetugasUsername());
        petugasRes.setPetugasPassword(petugasRes.getPetugasPassword());

        PetugasRoleRes petugasRoleRes = new PetugasRoleRes();
        petugasRoleRes.setRolePetugasId(petugas.getPetugasRole().getRoleId());
        petugasRoleRes.setRolePetugasName(petugas.getPetugasRole().getRoleName());
        petugasRoleRes.setRolePetugasDesc(petugas.getPetugasRole().getRoleDesc());
        petugasRes.setPetugasRole(petugasRoleRes);
        return petugasRes;
    }
}
