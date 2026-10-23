package com.spacecode.server.services;

import com.spacecode.server.dtos.StaffInput;
import com.spacecode.server.entities.Staff;
import com.spacecode.server.enums.StaffRole;
import com.spacecode.server.repositories.StaffRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffService {
  private final StaffRepository staffRep;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

  public List<Staff> getAll() {
    return staffRep.findAll();
  }

  public void save(StaffInput input) {
    Staff staff =
        Staff.builder()
            .name(input.name())
            .username(input.username())
            .password(encoder.encode(input.password()))
            .role(StaffRole.valueOf(input.role()))
            .build();
    staffRep.save(staff);
  }

  public void change(Staff input, String id) {
    Staff staff = staffRep.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    staff.setName(input.getName());
    staff.setUsername(input.getUsername());
    staff.setRole(input.getRole());

    staffRep.save(staff);
  }

  public void delete(String id) {
    Staff staff = staffRep.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    staffRep.delete(staff);
  }
}
