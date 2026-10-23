package com.spacecode.server.repositories;

import com.spacecode.server.entities.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {}
