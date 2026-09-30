package com.example.notes.service;

import java.security.Security;
import java.util.List;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.stereotype.Service;

import com.example.notes.VapidConfig;
import com.example.notes.model.Note;
import com.example.notes.model.PushSubscription;
import com.example.notes.repository.PushSubscriptionRepository;

import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;

@Service
public class WebPushService {

    private final PushSubscriptionRepository repository;
    private final VapidConfig vapidConfig;

    public WebPushService(
            PushSubscriptionRepository repository,
            VapidConfig vapidConfig
    ) {
        this.repository = repository;
        this.vapidConfig = vapidConfig;

        if (Security.getProvider("BC") == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    public void sendTestNotification(Integer userId) throws Exception {

        List<PushSubscription> subscriptions =
                repository.findByUserId(userId);

        if (subscriptions.isEmpty()) {
            throw new IllegalStateException(
                    "No push subscription found for this user"
            );
        }

        String payload =
                "{\"title\":\"NoteFlow\",\"body\":\"Push notification test successful!\"}";

        PushService pushService =
                new PushService(
                        vapidConfig.getPublicKey(),
                        vapidConfig.getPrivateKey(),
                        "mailto:noteflow@example.com"
                );

        for (PushSubscription subscription : subscriptions) {

            Notification notification =
                    new Notification(
                            subscription.getEndpoint(),
                            subscription.getP256dh(),
                            subscription.getAuth(),
                            payload
                    );

            pushService.send(notification);
        }
    }

    public void sendReminderNotification(Note note) throws Exception {

        List<PushSubscription> subscriptions =
                repository.findByUserId(note.getUserId());

        if (subscriptions.isEmpty()) {
            throw new IllegalStateException(
                    "No push subscription found for this user"
            );
        }

        String title = "NoteFlow Reminder";
        String body = "Reminder: " + note.getTitle();

        String payload =
                "{\"title\":\"" + title + "\"," +
                "\"body\":\"" + body + "\"," +
                "\"tag\":\"noteflow-reminder-" + note.getNoteId() + "\"," +
                "\"noteId\":" + note.getNoteId() + "}";

        PushService pushService =
                new PushService(
                        vapidConfig.getPublicKey(),
                        vapidConfig.getPrivateKey(),
                        "mailto:noteflow@example.com"
                );

        for (PushSubscription subscription : subscriptions) {

            Notification notification =
                    new Notification(
                            subscription.getEndpoint(),
                            subscription.getP256dh(),
                            subscription.getAuth(),
                            payload
                    );

            pushService.send(notification);
        }
    }
}