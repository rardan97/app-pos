package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.controller.AuthPetugasController;
import com.blackcode.pos_be.dto.petugas.*;
import com.blackcode.pos_be.exception.RoleNotFoundException;
import com.blackcode.pos_be.exception.TokenRefreshException;
import com.blackcode.pos_be.exception.UsernameAlreadyExistsException;
import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.model.petugas.PetugasRefreshToken;
import com.blackcode.pos_be.model.petugas.PetugasRole;
import com.blackcode.pos_be.model.petugas.PetugasToken;
import com.blackcode.pos_be.repository.PetugasRepository;
import com.blackcode.pos_be.repository.PetugasRoleRepository;
import com.blackcode.pos_be.repository.PetugasTokenRepository;
import com.blackcode.pos_be.security.jwt.JwtUtils;
import com.blackcode.pos_be.security.service.PetugasDetailsImpl;
import com.blackcode.pos_be.security.service.PetugasRefreshTokenService;
import com.blackcode.pos_be.security.service.PetugasTokenService;
import com.blackcode.pos_be.service.AuthPetugasService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthPetugasServiceImpl implements AuthPetugasService {

    private static final Logger logger = LoggerFactory.getLogger(AuthPetugasServiceImpl.class);

    private final PasswordEncoder encoder;

    private final AuthenticationManager authenticationManager;

    private final PetugasRepository petugasRepository;

    private final PetugasTokenRepository petugasTokenRepository;

    private final PetugasRoleRepository petugasRoleRepository;

    private final PetugasTokenService petugasTokenService;

    private final JwtUtils jwtUtils;

    private final PetugasRefreshTokenService petugasRefreshTokenService;

    public AuthPetugasServiceImpl(PasswordEncoder encoder,
                                  AuthenticationManager authenticationManager,
                                  PetugasRepository petugasRepository,
                                  PetugasTokenRepository petugasTokenRepository,
                                  PetugasRoleRepository petugasRoleRepository,
                                  PetugasTokenService petugasTokenService,
                                  JwtUtils jwtUtils,
                                  PetugasRefreshTokenService petugasRefreshTokenService) {
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.petugasRepository = petugasRepository;
        this.petugasTokenRepository = petugasTokenRepository;
        this.petugasRoleRepository = petugasRoleRepository;
        this.petugasTokenService = petugasTokenService;
        this.jwtUtils = jwtUtils;
        this.petugasRefreshTokenService = petugasRefreshTokenService;
    }


    @Override
    public PetugasJwtRes singIn(PetugasLoginReq loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        PetugasDetailsImpl petugasDetails = (PetugasDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtTokenPetugas(petugasDetails);
        petugasTokenService.processStaffTokenAdd(petugasDetails.getPetugasId(), jwt);
        List<String> roles = petugasDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        PetugasRefreshToken refreshToken = petugasRefreshTokenService.createRefreshToken(jwt, petugasDetails.getPetugasId());

        logger.info("User {} signed in successfully", petugasDetails.getUsername());

        return new PetugasJwtRes(
                jwt,
                refreshToken.getToken(),
                petugasDetails.getPetugasId(),
                petugasDetails.getUsername(),
                roles
        );
    }

    @Override
    public PetugasMessageRes signUp(PetugasSignUpReq petugasSignUpReq) {
        System.out.println("username : "+petugasSignUpReq.getUsername());
        if(petugasRepository.existsByPetugasUsername(petugasSignUpReq.getUsername())){
            throw new UsernameAlreadyExistsException("Username is already taken!");
        }
        System.out.println("role : "+petugasSignUpReq.getRole());
        long roleId = Long.parseLong(petugasSignUpReq.getRole());
        PetugasRole roleData = petugasRoleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException("Role not found with id:" + roleId));

        Petugas petugas = new Petugas(
                petugasSignUpReq.getFullName(),
                petugasSignUpReq.getEmail(),
                petugasSignUpReq.getUsername(),
                encoder.encode(petugasSignUpReq.getPassword()),
                roleData);
        petugasRepository.save(petugas);
        return new PetugasMessageRes("Success Register Petugas");
    }

    @Override
    public PetugasTokenRefreshRes refreshToken(PetugasTokenRefreshReq request) {
        PetugasTokenRefreshRes petugasTokenRefreshRes = null;
        String requestRefreshToken = request.getRefreshToken();
        Optional<PetugasRefreshToken> petugasRefreshToken = petugasRefreshTokenService.findByToken(requestRefreshToken);
        if(petugasRefreshToken.isPresent()){
            PetugasRefreshToken petugasRefreshToken1 = petugasRefreshToken.get();
            petugasRefreshToken1 = petugasRefreshTokenService.verifyExpiration(petugasRefreshToken1);
            Petugas petugas = petugasRefreshToken1.getPetugas();
            String token = jwtUtils.generateTokenFromUsername(petugas.getPetugasUsername());
            petugasTokenService.processStaffTokenRefresh(petugas.getPetugasFullName(), token);
            petugasTokenRefreshRes = new PetugasTokenRefreshRes(token, requestRefreshToken);
        }else {
            throw new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!");
        }
        return petugasTokenRefreshRes;
    }

    @Override
    public PetugasMessageRes signOut(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)) {
            String headerAuth = request.getHeader("Authorization");
            if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
                String jwtToken = headerAuth.substring(7);
                PetugasDetailsImpl userDetails = (PetugasDetailsImpl) authentication.getPrincipal();
                Long userId = userDetails.getPetugasId();

                Optional<PetugasToken> userTokenData = petugasTokenRepository.findByToken(jwtToken);
                if (userTokenData.isPresent()) {
                    petugasRefreshTokenService.deleteByPetugasId(userId);
                    PetugasToken petugasToken = userTokenData.get();
                    petugasToken.setIsActive(false);
                    petugasTokenRepository.save(petugasToken);
                    return new PetugasMessageRes("Logout successful!");
                } else {
                    return new PetugasMessageRes("Token not found, logout failed!");
                }
            } else {
                return new PetugasMessageRes("Authorization header is missing or invalid");
            }
        } else {
            return new PetugasMessageRes("User is not authenticated");
        }
    }
}
