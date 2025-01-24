package com.startup.RelationalMapping.Repository;

import com.startup.RelationalMapping.Entity.ProductDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductDetailsRepo extends JpaRepository<ProductDetails,Integer> {
    List<ProductDetails> findAllBycategory(String category);
    @Query("SELECT P FROM ProductDetails P WHERE P.category = :category OR P.description LIKE %:description%")
    List<ProductDetails> findAllByCategoryAndPrice(String category,String description);
}
