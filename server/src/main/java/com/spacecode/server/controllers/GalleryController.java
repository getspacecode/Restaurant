package com.spacecode.server.controllers;

import com.spacecode.server.dtos.GalleryInput;
import com.spacecode.server.entities.Gallery;
import com.spacecode.server.services.GalleryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/gallery")
@RequiredArgsConstructor
public class GalleryController {
  private final GalleryService galleryService;

  @MutationMapping
  public boolean createGallery(@Argument GalleryInput input) {
    galleryService.save(input);
    return true;
  }

  @SchemaMapping(typeName = "Gallery", field = "image")
  public String image(Gallery g) {
    return galleryService.getImage(g);
  }

  @QueryMapping
  public List<Gallery> galleries() {
    return galleryService.getAll();
  }

  @MutationMapping
  public boolean deleteGallery(@Argument int id) {
    galleryService.delete((long) id);
    return true;
  }
}
