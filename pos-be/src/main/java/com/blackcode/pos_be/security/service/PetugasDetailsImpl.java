package com.blackcode.pos_be.security.service;

import com.blackcode.pos_be.model.petugas.Petugas;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class PetugasDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1322963087909878166L;

    private Long petugasId;
    private String petugasUsername;

    @JsonIgnore
    private String petugasPassword;

    private final Collection<? extends GrantedAuthority> authorities;

    public PetugasDetailsImpl(Long petugasId, String petugasUsername, String petugasPassword, Collection<? extends GrantedAuthority> authorities) {
        this.petugasId = petugasId;
        this.petugasUsername = petugasUsername;
        this.petugasPassword = petugasPassword;
        this.authorities = authorities;
    }

    public static PetugasDetailsImpl build(Petugas petugas) {
        String roleName = petugas.getPetugasRole() != null ? petugas.getPetugasRole().getRoleName() : "DEFAULT";
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + roleName.toUpperCase()));
        return new PetugasDetailsImpl(
                petugas.getPetugasId(),
                petugas.getPetugasUsername(),
                petugas.getPetugasPassword(),
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getPetugasId() {
        return petugasId;
    }

    @Override
    public String getPassword() {
        return petugasPassword;
    }

    @Override
    public String getUsername() {
        return petugasUsername;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        PetugasDetailsImpl petugas = (PetugasDetailsImpl) o;
        return Objects.equals(petugasId, petugas.petugasId);
    }
}
