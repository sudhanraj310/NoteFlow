package com.example.notes.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.notes.model.Note;
import com.example.notes.repository.NoteRepository;

@Component
public class ReminderScheduler {

    private final NoteRepository noteRepository;
    private final WebPushService webPushService;

    public ReminderScheduler(
            NoteRepository noteRepository,
            WebPushService webPushService
    ) {
        this.noteRepository = noteRepository;
        this.webPushService = webPushService;
    }

    @Scheduled(fixedRate = 30000)
    public void checkReminders() {

        LocalDateTime now = LocalDateTime.now();

        List<Note> dueReminders =
                noteRepository.findDueReminders(now);

        System.out.println(
                "Due reminders found: " + dueReminders.size()
        );

        for (Note note : dueReminders) {

            try {

                webPushService.sendReminderNotification(note);

                noteRepository.markReminderSent(
                        note.getNoteId()
                );

                System.out.println(
                        "Reminder sent: " + note.getTitle()
                );

            } catch (Exception e) {

                System.out.println(
                        "Reminder failed for note "
                        + note.getNoteId()
                        + ": "
                        + e.getMessage()
                );
            }
        }
    }
}