package com.example.notes;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VapidConfig {

    @Value("${VAPID_PUBLIC_KEY}")
    private String publicKey;

    @Value("${VAPID_PRIVATE_KEY}")
    private String privateKey;

    public String getPublicKey() {
        return publicKey;
    }

    public String getPrivateKey() {
        return privateKey;
    }
}