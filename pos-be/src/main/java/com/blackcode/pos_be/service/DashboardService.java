package com.blackcode.pos_be.service;

import com.blackcode.pos_be.dto.dashboard.PopularProductRes;
import com.blackcode.pos_be.dto.dashboard.PopularTypeOrderRes;
import com.blackcode.pos_be.dto.dashboard.SectionCardRes;
import com.blackcode.pos_be.dto.dashboard.TransactionChartRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DashboardService {

    SectionCardRes totalRevenue();

    SectionCardRes unitsSold();

    SectionCardRes totalTransactions();

    SectionCardRes totalCustomers();

    List<PopularProductRes> popularProduct();

    List<PopularTypeOrderRes> popularTypeOrder();

    List<TransactionChartRes> transactionChart();
}
