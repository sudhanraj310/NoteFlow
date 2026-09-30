package com.example.notes.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.notes.VapidConfig;
import com.example.notes.service.PushService;
import com.example.notes.service.WebPushService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/push")
public class PushController {

    private final VapidConfig vapidConfig;
    private final PushService pushService;
    private final WebPushService webPushService;

    public PushController(
            VapidConfig vapidConfig,
            PushService pushService,
            WebPushService webPushService
    ) {
        this.vapidConfig = vapidConfig;
        this.pushService = pushService;
        this.webPushService = webPushService;
    }

    @GetMapping("/public-key")
    public String getPublicKey() {
        return vapidConfig.getPublicKey();
    }

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(
            @RequestBody Map<String, Object> subscription,
            HttpSession session
    ) {

        Object userIdObject = session.getAttribute("userId");

        if (userIdObject == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Not logged in"));
        }

        Integer userId = (Integer) userIdObject;

        String endpoint = (String) subscription.get("endpoint");

        @SuppressWarnings("unchecked")
        Map<String, String> keys =
                (Map<String, String>) subscription.get("keys");

        if (endpoint == null || keys == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid subscription"));
        }

        String p256dh = keys.get("p256dh");
        String auth = keys.get("auth");

        if (p256dh == null || auth == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid subscription keys"));
        }

        pushService.saveSubscription(
                userId,
                endpoint,
                p256dh,
                auth
        );

        return ResponseEntity.ok(
                Map.of("message", "Push subscription saved")
        );
    }
    @PostMapping("/test")
    
public ResponseEntity<?> testPush(HttpSession session) {

    Object userIdObject = session.getAttribute("userId");

    if (userIdObject == null) {
        return ResponseEntity.status(401)
                .body(Map.of("message", "Not logged in"));
    }

    Integer userId = (Integer) userIdObject;

    try {
        webPushService.sendTestNotification(userId);

        return ResponseEntity.ok(
                Map.of("message", "Push notification sent")
        );

    } catch (Exception e) {
        e.printStackTrace();

        return ResponseEntity.internalServerError()
                .body(Map.of(
                        "message",
                        e.getMessage() != null
                                ? e.getMessage()
                                : "Push notification failed"
                ));
    }
}
}