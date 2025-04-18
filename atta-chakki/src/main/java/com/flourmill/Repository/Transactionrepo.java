package com.flourmill.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flourmill.Entity.Transactions;
@Repository
public interface Transactionrepo extends JpaRepository<Transactions, Integer>{
	List<Transactions> findByCustomerCustId(int custId);
 // this will fetch all transactions with matching customer ID

}
