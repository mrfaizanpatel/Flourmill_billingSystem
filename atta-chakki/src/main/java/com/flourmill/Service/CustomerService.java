package com.flourmill.Service;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flourmill.Entity.Customer;
import com.flourmill.Repository.Customer_repo;

@Service
public class CustomerService {

	@Autowired
	private Customer_repo customerrepo;
	
	public Customer savecust(Customer customer) {
		return customerrepo.save(customer);
	}
	
	public List<Customer>getalluser(){
		return customerrepo.findAll();
	}
	
	public Optional<Customer> getbyid(int id) {
		return customerrepo.findById(id);
	}
	
	public void deletebyid(int id){
		
         customerrepo.deleteById(id);;		
	}
	
	public Customer Updatecust(Customer customer,int id) {
		Optional<Customer>existingcust=customerrepo.findById(id);
		if(existingcust.isPresent()) {
			Customer updatedcust=existingcust.get();
			updatedcust.setCust_name(customer.getCust_name());
			updatedcust.setCust_phone(customer.getCust_phone());
			updatedcust.setCust_Address(customer.getCust_Address());
			
			return customerrepo.save(updatedcust);

		}else {
			return null;
		}
	}
}
