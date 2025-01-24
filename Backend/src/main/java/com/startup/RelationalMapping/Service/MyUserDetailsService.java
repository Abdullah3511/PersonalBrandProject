package com.startup.RelationalMapping.Service;

import com.startup.RelationalMapping.Entity.UserPrincipal;
import com.startup.RelationalMapping.Entity.Users;
import com.startup.RelationalMapping.Repository.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    UsersRepo usersRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       Users user = usersRepo.findByuserName(username);
       if(user == null){
           System.out.println(" user is null");
           throw new UsernameNotFoundException("user is empty");
       }

       return new UserPrincipal(user);
    }
}
