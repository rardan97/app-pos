package com.blackcode.pos_be.security.service;

import com.blackcode.pos_be.exception.TokenRefreshException;
import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.model.petugas.PetugasRefreshToken;
import com.blackcode.pos_be.repository.PetugasRefreshTokenRepository;
import com.blackcode.pos_be.repository.PetugasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PetugasRefreshTokenService {

    @Value("${blackcode.app.jwtRefreshExpirationMs}")
    private int refreshTokenDurationMs;

    private final PetugasRefreshTokenRepository petugasRefreshTokenRepository;

    private final PetugasRepository petugasRepository;

    private final PetugasTokenService petugasTokenService;

    public PetugasRefreshTokenService(PetugasRefreshTokenRepository petugasRefreshTokenRepository,
                                      PetugasRepository petugasRepository,
                                      PetugasTokenService petugasTokenService) {
        this.petugasRefreshTokenRepository = petugasRefreshTokenRepository;
        this.petugasRepository = petugasRepository;
        this.petugasTokenService = petugasTokenService;
    }

    public Optional<PetugasRefreshToken> findByToken(String token){
        return petugasRefreshTokenRepository.findByToken(token);
    }

    public PetugasRefreshToken createRefreshToken(String jwt, Long petgasId){
        PetugasRefreshToken petugasRefreshToken = null;
        Optional<PetugasRefreshToken> existingToken = petugasRefreshTokenRepository.findByPetugasId(petgasId);
        if (existingToken.isPresent()) {
            petugasRefreshToken = new PetugasRefreshToken();
            petugasRefreshToken.setId(existingToken.get().getId());
            petugasRefreshToken.setPetugas(existingToken.get().getPetugas());
            petugasRefreshToken.setExpiryDate(existingToken.get().getExpiryDate());
            petugasRefreshToken.setToken(existingToken.get().getToken());
        }else{
            Petugas dataPetugas = petugasRepository.findById(petgasId).get();
            petugasRefreshToken = new PetugasRefreshToken();
            petugasRefreshToken.setPetugas(dataPetugas);
            petugasRefreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
            petugasRefreshToken.setToken(UUID.randomUUID().toString());
            petugasRefreshToken = petugasRefreshTokenRepository.save(petugasRefreshToken);
        }
        petugasTokenService.processStaffTokenAdd(petgasId, jwt);
        return petugasRefreshToken;
    }

    public PetugasRefreshToken verifyExpiration(PetugasRefreshToken token){
        if(token.getExpiryDate().compareTo(Instant.now()) < 0){
            petugasRefreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Transactional
    public void deleteByPetugasId(Long petugasId){
        petugasRefreshTokenRepository.deleteByPetugas(petugasRepository.findById(petugasId).get());
    }
}
