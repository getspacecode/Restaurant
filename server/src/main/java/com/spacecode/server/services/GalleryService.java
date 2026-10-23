package com.spacecode.server.services;

import com.spacecode.server.dtos.GalleryInput;
import com.spacecode.server.entities.Gallery;
import com.spacecode.server.enums.GalleryCategories;
import com.spacecode.server.repositories.GalleryRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GalleryService {
  private final GalleryRepository galleryRep;
  private final StorageService storageService;

  public boolean save(GalleryInput input) {
    Gallery gallery = new Gallery();

    gallery.setCaption(input.caption());
    GalleryCategories cat = GalleryCategories.valueOf(input.category());
    gallery.setCategory(cat);
    gallery.setImage(storageService.uploadImage(input.image(), "gallery"));
    galleryRep.save(gallery);
    return true;
  }

  public String getImage(Gallery g) {
    return storageService.getImage(g.getImage());
  }

  public List<Gallery> getAll() {
    return galleryRep.findAll();
  }

  @Transactional
  public void delete(Long id) {
    Gallery g =
        galleryRep.findById(id).orElseThrow(() -> new RuntimeException("Gallery not found"));
    String imageKey = g.getImage();
    storageService.delete(imageKey);
    galleryRep.delete(g);
  }
}
