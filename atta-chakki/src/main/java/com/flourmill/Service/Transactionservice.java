package com.flourmill.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flourmill.Entity.Customer;
import com.flourmill.Entity.Transactions;
import com.flourmill.Repository.Customer_repo;
import com.flourmill.Repository.Transactionrepo;

@Service
public class Transactionservice {


	@Autowired
	private Transactionrepo transactionrepo;
	
	@Autowired Customer_repo customer_repo;
	
	public Transactions savetransaction(Transactions transactions) {
		 // Set current time for check-in (intime) when saving
        transactions.setIn_time(LocalDateTime.now());
        
		if (transactions.getCustomer() != null && transactions.getCustomer().getCust_id() > 0) {
		    Optional<Customer> customer = customer_repo.findById(transactions.getCustomer().getCust_id());
		    customer.ifPresent(transactions::setCustomer);
		}

		return transactionrepo.save(transactions);
	}
	
	public List<Transactions>getalltransaction(){
		return transactionrepo.findAll();
	}
	
	public Optional<Transactions> gettransactionbyid(int id) {
		return transactionrepo.findById(id);
	}
	
	public String deletetransactionbyid(int id){
		transactionrepo.deleteById(id);
        return "";		
	}
	
	public Transactions Updatetransaction(Transactions transactions,int id) {
		
		Optional<Transactions>existingcust=transactionrepo.findById(id);
		if(existingcust.isPresent()) {
			Transactions updatedtransaction=existingcust.get();
			
			updatedtransaction.setIn_time(transactions.getIn_time());
			updatedtransaction.setOut_time(LocalDateTime.now());
			updatedtransaction.setFlour_type(transactions.getFlour_type());
			updatedtransaction.setQuantity(transactions.getQuantity());
			updatedtransaction.setUnit_price(transactions.getUnit_price());
			updatedtransaction.setTotal(transactions.getTotal());
			
		
			 // ✅ Update customer if provided in the request
            if (transactions.getCustomer() != null && transactions.getCustomer().getCust_id() > 0) {
                Optional<Customer> customer = customer_repo.findById(transactions.getCustomer().getCust_id());
                customer.ifPresent(updatedtransaction::setCustomer);
            }
			return transactionrepo.save(updatedtransaction);
		
		

		}else {
			return null;
		}
	}
	
	public List<Transactions>getTransactionsByCustomerId(int cust_id){
		return transactionrepo.findByCustomerCustId(cust_id);
	}
}
