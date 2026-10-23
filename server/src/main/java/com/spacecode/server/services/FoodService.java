package com.spacecode.server.services;

import com.spacecode.server.dtos.FoodInput;
import com.spacecode.server.entities.Category;
import com.spacecode.server.entities.Food;
import com.spacecode.server.repositories.CategoryRepository;
import com.spacecode.server.repositories.FoodRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FoodService {

  private final FoodRepository foodRepository;
  private final CategoryRepository categoryRepository;
  private final StorageService storageService;

  public Food save(FoodInput input) {
    Category category =
        categoryRepository
            .findById(input.categoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));

    Food food;
    if (input.id() != null) {
      food =
          foodRepository
              .findById(input.id())
              .orElseThrow(() -> new RuntimeException("Food not found"));
    } else {
      food = new Food();
    }

    food.setName(input.name());
    food.setPrice(input.price());
    food.setCategory(category);
    food.setDescription(input.description());
    food.setAvailable(input.available());

    if (input.image() != null && !input.image().isBlank()) {
      food.setImageKey(storageService.uploadImage(input.image(), "foods"));
    }

    return foodRepository.save(food);
  }

  public List<Food> all() {
    return foodRepository.findAll();
  }

  public List<Food> getAvailable() {
    return foodRepository.findByAvailableTrue();
  }

  @Transactional
  public void delete(int id) {
    Food food =
        foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
    String imageKey = food.getImageKey();
    storageService.delete(imageKey);
    foodRepository.delete(food);
  }

  public void changeAvailable(int id, boolean available) {
    Food food =
        foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
    food.setAvailable(available);
    foodRepository.save(food);
  }

  public String getImage(Food food) {
    return storageService.getImage(food.getImageKey());
  }
}
