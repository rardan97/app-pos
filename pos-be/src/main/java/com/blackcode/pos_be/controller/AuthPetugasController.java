package com.blackcode.pos_be.controller;

import com.blackcode.pos_be.common.dto.ApiResponse;
import com.blackcode.pos_be.dto.petugas.*;
import com.blackcode.pos_be.security.jwt.AuthTokenFilter;
import com.blackcode.pos_be.service.AuthPetugasService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthPetugasController {

    private static final Logger logger = LoggerFactory.getLogger(AuthPetugasController.class);

    private final AuthPetugasService authPetugasService;

    public AuthPetugasController(AuthPetugasService authPetugasService) {
        this.authPetugasService = authPetugasService;
    }

    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<?>> authenticatePetugas(@Valid @RequestBody PetugasLoginReq loginRequest) {
        PetugasJwtRes petugasJwtRes = authPetugasService.singIn(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login Success", 200, petugasJwtRes));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<?>> registerUser(@Valid @RequestBody PetugasSignUpReq petugasSignUpReq) {
        PetugasMessageRes petugasMessageRes = authPetugasService.signUp(petugasSignUpReq);
        return ResponseEntity.ok(ApiResponse.success("Success Registration", 200, petugasMessageRes));
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<ApiResponse<?>> refreshtoken(@Valid @RequestBody PetugasTokenRefreshReq request) {
        PetugasTokenRefreshRes petugasTokenRefreshRes = authPetugasService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", 200, petugasTokenRefreshRes));
    }

    @PostMapping("/signout")
    public ResponseEntity<ApiResponse<?>> logout(HttpServletRequest request) {
        PetugasMessageRes petugasMessageRes = authPetugasService.signOut(request);
        return ResponseEntity.ok(ApiResponse.success("Logout successful", 200, petugasMessageRes));
    }

//    @GetMapping("/getRoleListAll")
//    public ResponseEntity<List<PetugasRoleRes>> getRoleListAll(){
//        List<PetugasRoleRes> petugasRoleRes = petugasRoleService.getListAllRole();
//        System.out.println(petugasRoleRes.size());
//        return ResponseEntity.ok(petugasRoleRes);
//    }
}