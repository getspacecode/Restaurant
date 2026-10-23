package com.spacecode.server.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.spacecode.server.enums.StaffRole;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(
    name = "staff",
    uniqueConstraints = @UniqueConstraint(name = "uk_staff_username", columnNames = "username"))
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Staff {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false, unique = true, length = 50)
  private String username;

  @Column(name = "password", nullable = false, length = 100)
  @JsonIgnore
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private StaffRole role;

  @CreationTimestamp
  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;
}
