package com.example.notes.service;

import com.example.notes.model.PushSubscription;
import com.example.notes.repository.PushSubscriptionRepository;
import org.springframework.stereotype.Service;

@Service
public class PushService {

    private final PushSubscriptionRepository repository;

    public PushService(PushSubscriptionRepository repository) {
        this.repository = repository;
    }

    public void saveSubscription(
            Integer userId,
            String endpoint,
            String p256dh,
            String auth
    ) {
        PushSubscription subscription = new PushSubscription();

        subscription.setUserId(userId);
        subscription.setEndpoint(endpoint);
        subscription.setP256dh(p256dh);
        subscription.setAuth(auth);

        repository.save(subscription);
    }
}