package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${upload.dir}")
    private String uploadDir;


    @Override
    public String store(MultipartFile file) {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filename = UUID.randomUUID().toString();

        try {
            Path targetLocation = Paths.get(uploadDir + File.separator + filename);
            Files.copy(file.getInputStream(), targetLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file " + filename, ex);
        }

        return filename;
    }

    @Override
    public byte[] load(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            return Files.readAllBytes(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to load file " + filename, ex);
        }
    }

    @Override
    public void delete(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Files.delete(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Failed to delete file " + filename, ex);
        }
    }
}
