package com.blackcode.pos_be.service;

import com.blackcode.pos_be.dto.petugas.*;
import com.blackcode.pos_be.model.petugas.PetugasRefreshToken;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Optional;

public interface AuthPetugasService {

    PetugasJwtRes singIn(PetugasLoginReq loginRequest);

    PetugasMessageRes signUp(PetugasSignUpReq petugasSignUpReq);

    PetugasTokenRefreshRes refreshToken(PetugasTokenRefreshReq request);

    PetugasMessageRes signOut(HttpServletRequest request);


}
