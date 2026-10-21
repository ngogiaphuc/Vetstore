package com.sporthub.config;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureStorageConfig {

    @Bean
    @ConditionalOnExpression("!'${azure.storage.connection-string:}'.isBlank()")
    public BlobServiceClient blobServiceClient(
            @Value("${azure.storage.connection-string:}")
            String connectionString) {

        return new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
    }

    @Bean
    @ConditionalOnExpression("!'${azure.storage.connection-string:}'.isBlank()")
    public BlobContainerClient blobContainerClient(
            BlobServiceClient blobServiceClient,
            @Value("${azure.storage.container-name:sporthub-images}")
            String containerName) {

        BlobContainerClient containerClient =
                blobServiceClient.getBlobContainerClient(containerName);

        try {
            containerClient.createIfNotExists();
        } catch (Exception ignored) {
        }

        return containerClient;
    }
}
