package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.dto.ImageLoadDto;
import com.blackcode.pos_be.dto.ProductReq;
import com.blackcode.pos_be.dto.ProductRes;
import com.blackcode.pos_be.exception.DataNotFoundException;
import com.blackcode.pos_be.model.Category;
import com.blackcode.pos_be.model.Product;
import com.blackcode.pos_be.repository.CategoryRepository;
import com.blackcode.pos_be.repository.ProductRepository;
import com.blackcode.pos_be.service.FileStorageService;
import com.blackcode.pos_be.service.ProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.*;

@Service
public class ProductServiceImpl implements ProductService {

    @Value("${upload.dir}")
    private String uploadDir;

    private final FileStorageService storageService;

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(FileStorageService storageService, ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.storageService = storageService;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ProductRes> getAllProduct() {
        List<Product> productList = productRepository.findAll();
        if(productList.isEmpty()){
            throw new DataNotFoundException("No Product found");
        }
        return productList.stream().map(this::mapToProductRes).toList();
    }

    @Override
    public ProductRes getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Product not found with id: "+productId));
        return mapToProductRes(product);
    }

    @Override
    public ProductRes createProduct(ProductReq productReq, MultipartFile productImage) {

        Category category = categoryRepository.findById(Long.valueOf(productReq.getProductCategoryId()))
                .orElseThrow(() -> new DataNotFoundException("Category not found with id: " + productReq.getProductCategoryId()));

        Product product = new Product();
        product.setProductName(productReq.getProductName());
        product.setProductDescription(productReq.getProductDescription());
        product.setProductPrice(productReq.getProductPrice());

        if (productImage != null && !productImage.isEmpty()) {
            String imagePath = storageService.store(productImage);
            productReq.setProductImage(imagePath);
            product.setProductImage(productReq.getProductImage());
        }

        product.setProductCategory(category);
        product = productRepository.save(product);
        return mapToProductRes(product);
    }

    @Override
    public ProductRes updateProduct(Long productId, ProductReq productReq, MultipartFile productImage) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Product not found with id: "+productId));

        Category category = categoryRepository.findById(Long.valueOf(productReq.getProductCategoryId()))
                .orElseThrow(() -> new DataNotFoundException("Category not found with id: " + productReq.getProductCategoryId()));

        product.setProductName(productReq.getProductName());
        product.setProductDescription(productReq.getProductDescription());
        product.setProductPrice(productReq.getProductPrice());
        product.setProductStock(productReq.getProductStock());
        updateProductImage(product, productImage);

        product.setProductCategory(category);
        product = productRepository.save(product);
        return mapToProductRes(product);
    }


    @Override
    public Map<String, Object> deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new DataNotFoundException("Role with ID "+productId+ "Not Found"));

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("deleteProductId", product);
        responseData.put("info", "The product was removed from database.");
        return responseData;
    }

    @Override
    public ImageLoadDto loadImage(String filename) {
        ImageLoadDto imageLoadDto = new ImageLoadDto();
        byte[] image = storageService.load(filename);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        return new ImageLoadDto(image, headers);
    }


    private ProductRes mapToProductRes(Product product) {
        ProductRes productRes = new ProductRes();
        productRes.setProductId(product.getProductId());
        productRes.setProductName(product.getProductName());
        productRes.setProductDescription(product.getProductDescription());
        productRes.setProductPrice(product.getProductPrice());
        productRes.setProductStock(product.getProductStock());
        productRes.setProductImage(product.getProductImage());

        CategoryRes categoryRes = new CategoryRes();
        categoryRes.setCategoryId(product.getProductCategory().getCategoryId());
        categoryRes.setCategoryName(product.getProductCategory().getCategoryName());
        productRes.setProductCategory(categoryRes);
        return productRes;
    }

    private void updateProductImage(Product product, MultipartFile productImage) {
        if (productImage == null || productImage.isEmpty()) return;

        String existingImage = product.getProductImage();
        if (existingImage != null && !existingImage.isEmpty()) {
            if (!existingImage.equals(productImage.getOriginalFilename())) {
                File file = new File(uploadDir + File.separator + existingImage);
                if (file.exists()) {
                    storageService.delete(existingImage);
                } else {
                    System.out.println("Gambar Tidak Tersedia di Storage");
                }

                String newImagePath = storageService.store(productImage);
                product.setProductImage(newImagePath);
            } else {
                System.out.println("Image user tidak di ganti");
            }
        } else {
            String newImagePath = storageService.store(productImage);
            product.setProductImage(newImagePath);
        }
    }
}
