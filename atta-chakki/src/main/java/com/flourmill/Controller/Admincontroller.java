package com.flourmill.Controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flourmill.Entity.Admin;
import com.flourmill.Service.Adminservice;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api")
public class Admincontroller {
	@Autowired
	private Adminservice adminservice;
	
	//just testing project
@GetMapping("/test")
	public String test() {
		return "this is testing";
	}

//postdata into database

@PostMapping("/users")
public ResponseEntity<Admin> createUser(@RequestBody Admin user) {
    return ResponseEntity.ok(adminservice.savedata(user));
}

//for login of  admin
@PostMapping("/login")
public ResponseEntity<?>loginadmin(@RequestBody Admin admin){
	Optional<Admin>existingadmin=adminservice.loginadmin(admin.getName(), admin.getPassword());
	
	if(existingadmin.isPresent()) {
		return ResponseEntity.ok("login successfull");
		}else {
			return ResponseEntity.status(401).body("invalid username and password");
		}
}

}
