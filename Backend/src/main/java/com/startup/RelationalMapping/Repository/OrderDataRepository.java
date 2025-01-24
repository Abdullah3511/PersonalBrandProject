package com.startup.RelationalMapping.Repository;

import com.startup.RelationalMapping.Entity.OrderData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDataRepository extends JpaRepository<OrderData,Integer> {
}
