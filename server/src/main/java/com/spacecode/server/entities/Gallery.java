package com.spacecode.server.entities;

import com.spacecode.server.enums.GalleryCategories;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@RequiredArgsConstructor
@Setter
@Getter
public class Gallery {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Column(updatable = true, nullable = false)
  private String caption;

  @Column(updatable = false, nullable = false)
  private String image;

  @Enumerated(EnumType.STRING)
  @Column(updatable = false, nullable = false)
  private GalleryCategories category;
}
