package com.example.notes.controller;

import com.example.notes.model.Note;
import com.example.notes.service.NoteService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> getAllNotes(HttpSession session) {
        int userId = getUserId(session);
        return noteService.getAllNotes(userId);
    }

    @GetMapping("/{id}")
    public Note getNote(
            @PathVariable int id,
            HttpSession session) {

        int userId = getUserId(session);
        return noteService.getNote(userId, id);
    }

    @PostMapping
    public ResponseEntity<Note> createNote(
            @RequestBody Note note,
            HttpSession session) {

        int userId = getUserId(session);

        Note createdNote =
                noteService.createNote(userId, note);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdNote);
    }

    @PutMapping("/{id}")
    public Note updateNote(
            @PathVariable int id,
            @RequestBody Note note,
            HttpSession session) {

        int userId = getUserId(session);

        return noteService.updateNote(
                userId,
                id,
                note
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable int id,
            HttpSession session) {

        int userId = getUserId(session);

        noteService.deleteNote(userId, id);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<Note> searchNotes(
            @RequestParam(required = false) String keyword,
            HttpSession session) {

        int userId = getUserId(session);

        return noteService.search(
                userId,
                keyword
        );
    }

    @PutMapping("/{id}/pin")
    public Note togglePin(
            @PathVariable int id,
            HttpSession session) {

        int userId = getUserId(session);

        return noteService.togglePin(
                userId,
                id
        );
    }

    private int getUserId(HttpSession session) {

        Object userId = session.getAttribute("userId");

        if (userId == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Please login first"
            );
        }

        return (Integer) userId;
    }
}