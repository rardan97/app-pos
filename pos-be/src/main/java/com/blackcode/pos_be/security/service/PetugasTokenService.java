package com.blackcode.pos_be.security.service;

import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.model.petugas.PetugasToken;
import com.blackcode.pos_be.repository.PetugasRepository;
import com.blackcode.pos_be.repository.PetugasTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
public class PetugasTokenService {

    @Value("${blackcode.app.jwtRefreshExpirationMs}")
    private int refreshTokenDurationMs;

    @Value("${blackcode.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    private final PetugasTokenRepository petugasTokenRepository;

    private final PetugasRepository petugasRepository;

    public PetugasTokenService(PetugasTokenRepository petugasTokenRepository, PetugasRepository petugasRepository) {
        this.petugasTokenRepository = petugasTokenRepository;
        this.petugasRepository = petugasRepository;
    }

    public void processStaffTokenAdd(Long petugasId, String jwt){
        Date date = new Date((new Date()).getTime() + jwtExpirationMs);
        LocalDateTime localDateTime = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        Optional<PetugasToken> petugasTokenData = petugasTokenRepository.findByPetugasId(petugasId);
        if(petugasTokenData.isPresent()){
            petugasTokenData.get().setToken(jwt);
            petugasTokenData.get().setIsActive(true);
            petugasTokenData.get().setExpiryDate(localDateTime);
            petugasTokenData.get().setUpdatedAt(LocalDateTime.now());
            petugasTokenRepository.save(petugasTokenData.get());
        }else{
            PetugasToken petugasToken = new PetugasToken();
            petugasToken.setToken(jwt);
            petugasToken.setPetugasId(petugasId);
            petugasToken.setIsActive(true);
            petugasToken.setExpiryDate(localDateTime);
            petugasToken.setCreatedAt(LocalDateTime.now());
            petugasToken.setUpdatedAt(LocalDateTime.now());
            petugasTokenRepository.save(petugasToken);
        }
    }

    public void processStaffTokenRefresh(String userName, String jwt){
        Date date = new Date((new Date()).getTime() + jwtExpirationMs);
        LocalDateTime localDateTime = date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        Optional<Petugas> dataPetugas = petugasRepository.findByPetugasUsername(userName);
        if(dataPetugas.isPresent()){
            Optional<PetugasToken> petugasTokenData = petugasTokenRepository.findByPetugasId(dataPetugas.get().getPetugasId());
            if(petugasTokenData.isPresent()){
                petugasTokenData.get().setToken(jwt);
                petugasTokenData.get().setIsActive(true);
                petugasTokenData.get().setExpiryDate(localDateTime);
                petugasTokenData.get().setUpdatedAt(LocalDateTime.now());
                petugasTokenRepository.save(petugasTokenData.get());
            }
        }
    }
}
