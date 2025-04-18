package com.flourmill.Controller;

import java.util.List;
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
import com.flourmill.Entity.Transactions;
import com.flourmill.Service.Transactionservice;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api")
public class TransactionController {

	@Autowired
	private Transactionservice transactionservice;
	
	@PostMapping("/savetransaction")
	public ResponseEntity<Transactions>savetransaction(@RequestBody Transactions transactions){	
		return ResponseEntity.ok(transactionservice.savetransaction(transactions));
	}
	
	@GetMapping("/getalltransaction")
	public List<Transactions>getalltransaction(){
		return transactionservice.getalltransaction();
	}
	
	@GetMapping("/gettransactionbyid/{id}")
	public ResponseEntity<Optional<Transactions>> getCustomerbyid(@PathVariable int id){
		return ResponseEntity.ok(transactionservice.gettransactionbyid(id));
	}
	
	@GetMapping("/transactionsbycustid/customer/{cust_id}")
	public ResponseEntity<List<Transactions>> getTransactionsByCustomerId(@PathVariable int cust_id) {
	    List<Transactions> transactions = transactionservice.getTransactionsByCustomerId(cust_id);
	    return ResponseEntity.ok(transactions);
	}

	@DeleteMapping("/deletetransactionbyid/{id}")
	public String deletetransactinById(@PathVariable int id) {
		transactionservice.deletetransactionbyid(id);
		return "Data deleted successfully";
	}
	
	@PutMapping("/updattransactiondebyid/{id}")
	public ResponseEntity<Transactions>updataetransactionbyid(@RequestBody Transactions transactions,@PathVariable int id){
		return ResponseEntity.ok(transactionservice.Updatetransaction(transactions, id));
	}
}
