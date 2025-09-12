package com.blackcode.pos_be.security.service;

import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.repository.PetugasRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PetugasDetailsServiceImpl implements UserDetailsService {

    private final PetugasRepository petugasRepository;

    public PetugasDetailsServiceImpl(PetugasRepository petugasRepository) {
        this.petugasRepository = petugasRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Petugas petugas = petugasRepository.findByPetugasUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Staff Not Found with username: " + username));;

        return PetugasDetailsImpl.build(petugas);
    }
}