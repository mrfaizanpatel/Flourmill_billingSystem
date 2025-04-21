package com.flourmill.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flourmill.Entity.Members;

@Repository
public interface MemberRepo extends JpaRepository<Members, Integer>{

}
