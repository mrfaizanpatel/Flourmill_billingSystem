package com.flourmill.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flourmill.Entity.Admin;
import com.flourmill.Repository.Adminrepo;

@Service
public class Adminservice {

	@Autowired
	private Adminrepo adminrepo;
	
	//to post data into database logic
	public Admin savedata(Admin admin){
		return adminrepo.save(admin);
	}
	
	//code for login 
	public Optional<Admin>loginadmin(String name,String password){
		return adminrepo.findByNameAndPassword(name, password);
	}
	
}
