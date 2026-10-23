package com.spacecode.server.repositories;

import com.spacecode.server.entities.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff, String> {}
