package com.flourmill.Entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Customer {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
	int custId;
	String cust_name;
	String cust_phone;
	String cust_Address;
	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Transactions> transactions;
	
	public List<Transactions> getTransactions() {
		return transactions;
	}
	public void setTransactions(List<Transactions> transactions) {
		this.transactions = transactions;
	}
	public Customer() {
		
	}
	public int getCust_id() {
		return custId;
	}
	public void setCust_id(int cust_id) {
		this.custId = cust_id;
	}
	public String getCust_name() {
		return cust_name;
	}
	public void setCust_name(String cust_name) {
		this.cust_name = cust_name;
	}
	public String getCust_phone() {
		return cust_phone;
	}
	public void setCust_phone(String cust_phone) {
		this.cust_phone = cust_phone;
	}
	public String getCust_Address() {
		return cust_Address;
	}
	public void setCust_Address(String cust_Address) {
		this.cust_Address = cust_Address;
	}
	
/*	{
        "customer": {
            "cust_name": "Faizan_patel",
            "cust_phone": "987845610",
            "cust_Address": "beed by pass",
            "cust_id": 1
        },
        "in_time": "2000-01-01T10:00:00",
        "out_time": "1970-01-01T11:00:00",
        "flour_type": "gehoo",
        "quantity": "10",
        "unit_price": "5",
        "total": 50
    }
*/



}
