package com.spacecode.server.services;

import java.util.Base64;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class StorageService {

  private final S3Client s3Client;

  @Value("${neon.storage.bucket}")
  private String bucket;

  public StorageService(S3Client s3Client) {
    this.s3Client = s3Client;
  }

  public void upload(byte[] bytes, String contentType, String key) {
    PutObjectRequest request =
        PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build();

    s3Client.putObject(request, RequestBody.fromBytes(bytes));
  }

  // Returns the image as a data URL ("data:image/png;base64,...") so the client can show it
  // directly.
  public String getImage(String key) {
    if (key == null || key.isBlank()) {
      return null;
    }

    var request = GetObjectRequest.builder().bucket(bucket).key(key).build();
    var response = s3Client.getObjectAsBytes(request);

    String contentType = response.response().contentType();
    if (contentType == null) {
      contentType = "application/octet-stream";
    }

    String base64 = Base64.getEncoder().encodeToString(response.asByteArray());
    return "data:" + contentType + ";base64," + base64;
  }

  public void delete(String key) {
    if (key == null || key.isBlank()) {
      return;
    }

    var request = DeleteObjectRequest.builder().bucket(bucket).key(key).build();
    s3Client.deleteObject(request);
  }

  public String uploadImage(String dataUrl, String folder) {
    String contentType = dataUrl.substring("data:".length(), dataUrl.indexOf(';'));
    byte[] bytes = Base64.getDecoder().decode(dataUrl.substring(dataUrl.indexOf(',') + 1));

    // "image/png" -> ".png", "image/svg+xml" -> ".svg"
    String extension = contentType.substring(contentType.indexOf('/') + 1);
    if (extension.contains("+")) {
      extension = extension.substring(0, extension.indexOf('+'));
    }

    String imageKey = folder + "/" + UUID.randomUUID() + "." + extension;
    upload(bytes, contentType, imageKey);
    return imageKey;
  }
}
