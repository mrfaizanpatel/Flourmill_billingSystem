package com.flourmill.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flourmill.Entity.Customer;
@Repository
public interface Customer_repo extends JpaRepository<Customer, Integer>{

}
