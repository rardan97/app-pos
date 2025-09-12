package com.blackcode.pos_be.service;

import com.blackcode.pos_be.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public interface ProductService {

    List<ProductRes> getAllProduct();

    ProductRes getProductById(Long productId);

    ProductRes createProduct(ProductReq productReq, MultipartFile productImage);

    ProductRes updateProduct(Long productId, ProductReq productReq, MultipartFile productImage);

    Map<String, Object> deleteProduct(Long productId);

    ImageLoadDto loadImage(String filename);

}
