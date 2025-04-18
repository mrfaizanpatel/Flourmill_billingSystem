package com.flourmill.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flourmill.Entity.Admin;
@Repository
public interface Adminrepo extends JpaRepository<Admin,Integer>{
	
	Optional<Admin>findByNameAndPassword(String name,String password);

}
