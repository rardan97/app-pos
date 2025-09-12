package com.blackcode.pos_be.controller;

import com.blackcode.pos_be.common.dto.ApiResponse;
import com.blackcode.pos_be.dto.*;
import com.blackcode.pos_be.service.CategoryService;
import com.blackcode.pos_be.service.FileStorageService;
import com.blackcode.pos_be.service.ProductService;
import org.apache.kafka.shaded.com.google.protobuf.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/petugas/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/getProductListAll")
    public ResponseEntity<ApiResponse<List<ProductRes>>> getProductListAll(){
        List<ProductRes> productResList = productService.getAllProduct();
        return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", 200, productResList));
    }

    @GetMapping("/getProductFindById/{id}")
    public ResponseEntity<ApiResponse<ProductRes>> getProductFindById(@PathVariable("id") Long id){
        ProductRes productRes = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Category found", 200, productRes));
    }

    @PostMapping("/addProduct")
    public ResponseEntity<ApiResponse<ProductRes>> addProduct(
            @RequestPart("product") ProductReq productReq,
            @RequestPart(value = "productImage", required = false) MultipartFile productImage){

        ProductRes productRes = productService.createProduct(productReq, productImage);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Product created", 201, productRes));
    }

    @PutMapping("/updateProduct/{id}")
    public ResponseEntity<ApiResponse<ProductRes>> updateProduct(
            @PathVariable("id") Long id,
            @RequestPart("product") ProductReq productReq,
            @RequestPart(value = "productImage", required = false) MultipartFile productImage){

        ProductRes productRes = productService.updateProduct(id, productReq, productImage);
        return ResponseEntity.ok(ApiResponse.success("Product Update", 200, productRes));
    }

    @DeleteMapping("/deleteProductById/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteProductById(@PathVariable("id") Long id){
        Map<String, Object> rtn = productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("", 200, rtn));
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        ImageLoadDto imageLoadDto = productService.loadImage(filename);
        return new ResponseEntity<>(imageLoadDto.getImage(), imageLoadDto.getHeaders(), HttpStatus.OK);
    }
}
