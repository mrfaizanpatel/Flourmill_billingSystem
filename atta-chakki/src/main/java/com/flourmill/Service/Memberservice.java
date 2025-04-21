package com.flourmill.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flourmill.Entity.Members;
import com.flourmill.Repository.MemberRepo;

@Service
public class Memberservice {
	 @Autowired
	    private MemberRepo memberRepository;

	    public List<Members> getAllMembers() {
	        return memberRepository.findAll();
	    }

	    public Members getMemberById(int id) {
	        return memberRepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));
	    }

	    public Members addMember(Members member) {
	        member.setCreatedAt(LocalDateTime.now());
	        member.setUpdatedAt(LocalDateTime.now());
	        return memberRepository.save(member);
	    }

	    public Members updateMember(int id, Members updatedMember) {
	    	Members existing = getMemberById(id);

	        existing.setFullName(updatedMember.getFullName());
	        existing.setEmail(updatedMember.getEmail());
	        existing.setPhoneNumber(updatedMember.getPhoneNumber());
	        existing.setAddress(updatedMember.getAddress());
	        existing.setRole(updatedMember.getRole());
	        existing.setStatus(updatedMember.getStatus());
	        existing.setJoinedDate(updatedMember.getJoinedDate());
	        existing.setUsername(updatedMember.getUsername());
	        existing.setPassword(updatedMember.getPassword());
	        existing.setNotes(updatedMember.getNotes());
	        existing.setUpdatedAt(LocalDateTime.now());

	        return memberRepository.save(existing);
	    }

	    public void deleteMember(int id) {
	    	Members member = getMemberById(id);
	        memberRepository.delete(member);
	    }
}
