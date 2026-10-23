package com.spacecode.server.controllers;

import com.spacecode.server.dtos.StaffInput;
import com.spacecode.server.entities.Staff;
import com.spacecode.server.services.StaffService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
public class StaffController {
  private final StaffService staffService;

  @QueryMapping
  public List<Staff> staffs() {
    return staffService.getAll();
  }

  @MutationMapping
  public boolean createStaff(@Argument StaffInput input) {
    staffService.save(input);
    return true;
  }

  @MutationMapping
  public boolean changeStaff(@Argument Staff input, @Argument String id) {
    staffService.change(input, id);
    return true;
  }

  @MutationMapping
  public boolean deleteStaff(@Argument String id) {
    staffService.delete(id);
    return true;
  }
}
