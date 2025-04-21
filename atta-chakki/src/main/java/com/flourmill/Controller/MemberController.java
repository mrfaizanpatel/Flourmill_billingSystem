package com.flourmill.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.flourmill.Entity.Members;
import com.flourmill.Repository.MemberRepo;
import com.flourmill.Service.Memberservice;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MemberController {


    @Autowired
    private Memberservice memberService;


    @GetMapping("/getallmember")
    public List<Members> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/getmemberbyid/{id}")
    public ResponseEntity<Members> getMemberById(@PathVariable int id) {
        return ResponseEntity.ok(memberService.getMemberById(id));
    }

    @PostMapping("/savemember")
    public ResponseEntity<Members> addMember(@RequestBody Members member) {
        return new ResponseEntity<>(memberService.addMember(member), HttpStatus.CREATED);
    }

    @PutMapping("/updatememberbyid/{id}")
    public ResponseEntity<Members> updateMember(@PathVariable int id, @RequestBody Members member) {
        return ResponseEntity.ok(memberService.updateMember(id, member));
    }

    @DeleteMapping("/deletememberbyid/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable int id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok("Member deleted successfully");
    }
}

