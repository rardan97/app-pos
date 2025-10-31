package com.blackcode.pos_be.controller;

import com.blackcode.pos_be.dto.dashboard.PopularProductRes;
import com.blackcode.pos_be.dto.dashboard.PopularTypeOrderRes;
import com.blackcode.pos_be.dto.dashboard.SectionCardRes;
import com.blackcode.pos_be.dto.dashboard.TransactionChartRes;
import com.blackcode.pos_be.service.DashboardService;
import com.blackcode.pos_be.utils.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/petugas/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/getTotalRevenue")
    public ResponseEntity<ApiResponse<SectionCardRes>> getTotalRevenue(){
        SectionCardRes revenueRes = dashboardService.totalRevenue();
        return ResponseEntity.ok(ApiResponse.success("Revenue retrieved successfully", 200, revenueRes));
    }

    @GetMapping("/getUnitSold")
    public ResponseEntity<ApiResponse<SectionCardRes>> getUnitSold(){
        SectionCardRes unitsSold = dashboardService.unitsSold();
        return ResponseEntity.ok(ApiResponse.success("Unit Sold retrieved successfully", 200, unitsSold));
    }

    @GetMapping("/getTransaction")
    public ResponseEntity<ApiResponse<SectionCardRes>> getTransaction(){
        SectionCardRes totalTransactions = dashboardService.totalTransactions();
        return ResponseEntity.ok(ApiResponse.success("Transaction retrieved successfully", 200, totalTransactions));
    }

    @GetMapping("/getCustomers")
    public ResponseEntity<ApiResponse<SectionCardRes>> getCustomers(){
        SectionCardRes totalCustomers = dashboardService.totalCustomers();
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", 200, totalCustomers));
    }

    @GetMapping("/getPopularProduct")
    public ResponseEntity<ApiResponse<List<PopularProductRes>>> getPopularProduct(){
        List<PopularProductRes> mostPopularProductRes = dashboardService.popularProduct();
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", 200, mostPopularProductRes));
    }

    @GetMapping("/getPopularTypeOrder")
    public ResponseEntity<ApiResponse<List<PopularTypeOrderRes>>> getPopularTypeOrder(){
        List<PopularTypeOrderRes> popularTypeOrderResList = dashboardService.popularTypeOrder();
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", 200, popularTypeOrderResList));
    }

    @GetMapping("/getTransactionChart")
    public ResponseEntity<ApiResponse<List<TransactionChartRes>>> getTransactionChart(){
        List<TransactionChartRes> transactionChartResList = dashboardService.transactionChart();
        return ResponseEntity.ok(ApiResponse.success("Customer retrieved successfully", 200, transactionChartResList));
    }


}
