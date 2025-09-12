package com.blackcode.pos_be;

import com.blackcode.pos_be.dto.CategoryRes;
import com.blackcode.pos_be.model.Category;
import com.blackcode.pos_be.repository.CategoryRepository;
import com.blackcode.pos_be.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllCategories_shouldReturnList(){
        List<Category> categoryList = Arrays.asList(
          new Category(1L, "Food", "Food desc"),
          new Category(2L, "Drink", "Drink desc")
        );

        when(categoryRepository.findAll()).thenReturn(categoryList);

        List<CategoryRes> result = categoryService.getAllCategories();

        assertEquals(2, result.size());
        verify(categoryRepository, times(1)).findAll();
    }
}
