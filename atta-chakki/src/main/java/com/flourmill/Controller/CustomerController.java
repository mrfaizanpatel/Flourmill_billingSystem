package com.flourmill.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flourmill.Entity.Customer;
import com.flourmill.Service.CustomerService;
@CrossOrigin(origins = "http://localhost:4200") 
@RestController
@RequestMapping("/api")
public class CustomerController {

	@Autowired
	private CustomerService customerService;
	
	@PostMapping("/savecust")
	public ResponseEntity<Customer>saveCustomer(@RequestBody Customer customer){	
		return ResponseEntity.ok(customerService.savecust(customer));
	}
	
	@GetMapping("/getallcust")
	public List<Customer>getallcustomers(){
		return customerService.getalluser();
	}
	
	@GetMapping("/getbyid/{id}")
	public ResponseEntity<Optional<Customer>> getCustomerbyid(@PathVariable int id){
		return ResponseEntity.ok(customerService.getbyid(id));
	}
	
	@DeleteMapping("/deletebyid/{id}")
	public ResponseEntity<Map<String, String>> deletecustById(@PathVariable int id) {
		customerService.deletebyid(id);
		 Map<String, String> response = new HashMap<>();
	        response.put("message", "Customer deleted successfully");
	        return ResponseEntity.ok(response);
	}
	
	@PutMapping("/updatdebyid/{id}")
	public ResponseEntity<Customer>updataebyid(@RequestBody Customer customer,@PathVariable int id){
//		return ResponseEntity.ok(customerService.Updatecust(customer, id));
		Customer updatedCustomer = customerService.Updatecust(customer, id);
        if (updatedCustomer != null) {
            return ResponseEntity.ok(updatedCustomer);
        } else {
            return ResponseEntity.notFound().build();  // Return 404 if the customer is not found
        }
	}
}
