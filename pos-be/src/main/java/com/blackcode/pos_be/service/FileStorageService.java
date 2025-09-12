package com.blackcode.pos_be.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    String store(MultipartFile file);
    byte[] load(String filename);
    void delete(String filename);
}
