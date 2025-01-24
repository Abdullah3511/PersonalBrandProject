package com.startup.RelationalMapping.Repository;

import com.startup.RelationalMapping.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepo extends JpaRepository<Users,Integer> {
    Users findByuserName(String name);
    Users findByemail(String email);
}
