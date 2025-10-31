package com.blackcode.pos_be.service.impl;

import com.blackcode.pos_be.dto.dashboard.PopularProductRes;
import com.blackcode.pos_be.dto.dashboard.PopularTypeOrderRes;
import com.blackcode.pos_be.dto.dashboard.SectionCardRes;
import com.blackcode.pos_be.dto.dashboard.TransactionChartRes;
import com.blackcode.pos_be.model.Transaction;
import com.blackcode.pos_be.repository.TransactionRepository;
import com.blackcode.pos_be.service.DashboardService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final TransactionRepository transactionRepository;

    public DashboardServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public SectionCardRes totalRevenue() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        BigDecimal totalRevenue = allTransactions.stream()
                .map(t -> new BigDecimal(t.getGrossAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new SectionCardRes(
                "Total Revenue",
                totalRevenue,
                "Total revenue from all transactions"
        );
    }

    @Override
    public SectionCardRes unitsSold() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        BigDecimal totalRevenue = allTransactions.stream()
                .map(t -> new BigDecimal(t.getGrossAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new SectionCardRes(
                "Total Unit Sold",
                totalRevenue,
                "Total revenue from all transactions"
        );
    }

    @Override
    public SectionCardRes totalTransactions() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        BigDecimal totalRevenue = allTransactions.stream()
                .map(t -> new BigDecimal(t.getGrossAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new SectionCardRes(
                "Total Transaction",
                totalRevenue,
                "Total revenue from all transactions"
        );
    }

    @Override
    public SectionCardRes totalCustomers() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        BigDecimal totalRevenue = allTransactions.stream()
                .map(t -> new BigDecimal(t.getGrossAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new SectionCardRes(
                "Total Customer",
                totalRevenue,
                "Total revenue from all transactions"
        );
    }

    @Override
    public List<PopularProductRes> popularProduct() {
        List<PopularProductRes> resList = new ArrayList<>();

        // Dummy data produk populer
        String[] productNames = {
                "Mie Ayam", "Nasi Goreng", "Es Teh Manis", "Ayam Geprek",
                "Kopi Hitam"
        };

        BigDecimal[] prices = {
                BigDecimal.valueOf(20000),
                BigDecimal.valueOf(15000),
                BigDecimal.valueOf(8000),
                BigDecimal.valueOf(18000),
                BigDecimal.valueOf(12000)
        };

        Random random = new Random();

        for (int i = 0; i < productNames.length; i++) {
            PopularProductRes productRes = new PopularProductRes();
            productRes.setProductId((long) (i + 1));
            productRes.setProductName(productNames[i]);
            productRes.setProductPrice(prices[i]);
            productRes.setProductTotal(5000 + random.nextInt(20000)); // total penjualan acak

            resList.add(productRes);
        }

        return resList;
    }

    @Override
    public List<PopularTypeOrderRes> popularTypeOrder() {
        List<PopularTypeOrderRes> popularTypeOrderResList = new ArrayList<>();

        // Dummy nama tipe order
        String[] typeOrderNames = {
                "Drive Thru", "Onsite", "Take Away", "Online Delivery", "Self Pick-Up"
        };

        Random random = new Random();

        for (int i = 0; i < typeOrderNames.length; i++) {
            PopularTypeOrderRes typeOrderRes = new PopularTypeOrderRes();

            typeOrderRes.setTypeOrderId((long) (i + 1));
            typeOrderRes.setTypeOrderName(typeOrderNames[i]);
            typeOrderRes.setTypeOrderTotal(50000 + random.nextInt(200000));

            popularTypeOrderResList.add(typeOrderRes);
        }

        return popularTypeOrderResList;
    }

    @Override
    public List<TransactionChartRes> transactionChart() {
        List<TransactionChartRes> transactionChartResList = new ArrayList<>();

        Random random = new Random();

        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2025, 1, 1);

        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);

        for (int i = 0; i < 30; i++) {
            TransactionChartRes transactionChartRes = new TransactionChartRes();
            LocalDate randomDate = startDate.plusDays(random.nextInt((int) daysBetween));

            int transactionFood = 5000 + random.nextInt(10000);
            int transactionDrink = 3000 + random.nextInt(7000);

            transactionChartRes.setTransactionFood(transactionFood);
            transactionChartRes.setTransactionDrink(transactionDrink);
            transactionChartRes.setTransactionDate(java.sql.Date.valueOf(randomDate));

            transactionChartResList.add(transactionChartRes);
        }

        return transactionChartResList;
    }
}
