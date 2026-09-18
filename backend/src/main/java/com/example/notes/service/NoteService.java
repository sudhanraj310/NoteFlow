package com.example.notes.service;

import com.example.notes.model.Note;
import com.example.notes.repository.NoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    // Get all notes belonging to a user
    public List<Note> getAllNotes(int userId) {
        return noteRepository.findAll(userId);
    }

    // Get one note belonging to a user
    public Note getNote(int userId, int noteId) {
        return getExisting(userId, noteId);
    }

    // Create note for a user
    public Note createNote(int userId, Note note) {

        normalizeAndValidate(note);

        note.setUserId(userId);

        return noteRepository.save(note);
    }

    // Update user's own note
    public Note updateNote(
            int userId,
            int noteId,
            Note note) {

        getExisting(userId, noteId);

        normalizeAndValidate(note);

        note.setUserId(userId);

        return noteRepository.update(
                userId,
                noteId,
                note
        );
    }

    // Delete user's own note
    public void deleteNote(int userId, int noteId) {

        if (!noteRepository.delete(userId, noteId)) {
            throw notFound(noteId);
        }
    }

    // Search only user's notes
    public List<Note> search(
            int userId,
            String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return getAllNotes(userId);
        }

        return noteRepository.search(
                userId,
                keyword.trim()
        );
    }

    // Pin/unpin user's own note
    public Note togglePin(
            int userId,
            int noteId) {

        return noteRepository
                .togglePin(userId, noteId)
                .orElseThrow(() -> notFound(noteId));
    }

    private Note getExisting(
            int userId,
            int noteId) {

        return noteRepository
                .findById(userId, noteId)
                .orElseThrow(() -> notFound(noteId));
    }

    private ResponseStatusException notFound(int noteId) {

        return new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Note " + noteId + " was not found"
        );
    }

    private void normalizeAndValidate(Note note) {

        if (note == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Note cannot be null"
            );
        }

        if (note.getTitle() == null ||
                note.getTitle().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Title is required"
            );
        }

        note.setTitle(note.getTitle().trim());

        if (note.getContent() == null) {
            note.setContent("");
        }

        if (note.getCategory() == null ||
                note.getCategory().isBlank()) {

            note.setCategory("General");
        }

        if (note.getNoteType() == null ||
                note.getNoteType().isBlank()) {

            note.setNoteType("TEXT");
        }
    }
}