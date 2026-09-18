package com.example.notes.repository;

import com.example.notes.model.Note;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class NoteRepository {

    private static final String SELECT_COLUMNS =
            "note_id, user_id, title, content, category, note_type, " +
            "is_pinned, checklist_items, created_at, updated_at";

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public NoteRepository(
            JdbcTemplate jdbcTemplate,
            ObjectMapper objectMapper) {

        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    // Get all notes of a particular user
    public List<Note> findAll(int userId) {

        return jdbcTemplate.query(
                "SELECT " + SELECT_COLUMNS +
                " FROM notes " +
                "WHERE user_id = ? " +
                "ORDER BY is_pinned DESC, updated_at DESC",
                noteRowMapper,
                userId
        );
    }

    // Find a particular note belonging to a user
    public Optional<Note> findById(int userId, int noteId) {

        List<Note> results = jdbcTemplate.query(
                "SELECT " + SELECT_COLUMNS +
                " FROM notes " +
                "WHERE note_id = ? AND user_id = ?",
                noteRowMapper,
                noteId,
                userId
        );

        return results.stream().findFirst();
    }

    // Create note for a user
    public Note save(Note note) {

        String sql =
                "INSERT INTO notes " +
                "(user_id, title, content, category, note_type, " +
                "is_pinned, checklist_items) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";

        String checklistJson = serializeChecklist(note);

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement ps =
                    connection.prepareStatement(
                            sql,
                            Statement.RETURN_GENERATED_KEYS
                    );

            ps.setInt(1, note.getUserId());
            ps.setString(2, note.getTitle());
            ps.setString(3, note.getContent());
            ps.setString(4, note.getCategory());
            ps.setString(5, note.getNoteType());
            ps.setBoolean(6, note.isPinned());
            ps.setString(7, checklistJson);

            return ps;

        }, keyHolder);

        Number key = keyHolder.getKey();

        if (key != null) {
            return findById(
                    note.getUserId(),
                    key.intValue()
            ).orElse(note);
        }

        return note;
    }

    // Update only user's own note
    public Note update(int userId, int noteId, Note note) {

        String sql =
                "UPDATE notes SET " +
                "title = ?, " +
                "content = ?, " +
                "category = ?, " +
                "note_type = ?, " +
                "is_pinned = ?, " +
                "checklist_items = ?, " +
                "updated_at = CURRENT_TIMESTAMP " +
                "WHERE note_id = ? AND user_id = ?";

        jdbcTemplate.update(
                sql,
                note.getTitle(),
                note.getContent(),
                note.getCategory(),
                note.getNoteType(),
                note.isPinned(),
                serializeChecklist(note),
                noteId,
                userId
        );

        return findById(userId, noteId).orElse(note);
    }

    // Delete only user's own note
    public boolean delete(int userId, int noteId) {

        return jdbcTemplate.update(
                "DELETE FROM notes " +
                "WHERE note_id = ? AND user_id = ?",
                noteId,
                userId
        ) > 0;
    }

    // Search only inside user's notes
    public List<Note> search(int userId, String keyword) {

        String pattern = "%" + keyword + "%";

        return jdbcTemplate.query(
                "SELECT " + SELECT_COLUMNS +
                " FROM notes " +
                "WHERE user_id = ? " +
                "AND (title LIKE ? OR content LIKE ?) " +
                "ORDER BY is_pinned DESC, updated_at DESC",
                noteRowMapper,
                userId,
                pattern,
                pattern
        );
    }

    // Pin/unpin only user's own note
    public Optional<Note> togglePin(int userId, int noteId) {

        int updated = jdbcTemplate.update(
                "UPDATE notes " +
                "SET is_pinned = NOT is_pinned, " +
                "updated_at = CURRENT_TIMESTAMP " +
                "WHERE note_id = ? AND user_id = ?",
                noteId,
                userId
        );

        if (updated == 0) {
            return Optional.empty();
        }

        return findById(userId, noteId);
    }

    // Convert database row into Note object
    private final org.springframework.jdbc.core.RowMapper<Note> noteRowMapper =
            (rs, rowNum) -> {

                Note note = new Note();

                note.setNoteId(rs.getInt("note_id"));
                note.setUserId(rs.getInt("user_id"));
                note.setTitle(rs.getString("title"));
                note.setContent(rs.getString("content"));
                note.setCategory(rs.getString("category"));
                note.setNoteType(rs.getString("note_type"));
                note.setPinned(rs.getBoolean("is_pinned"));

                String checklistJson =
                        rs.getString("checklist_items");

                note.setChecklistItems(
                        deserializeChecklist(checklistJson)
                );

                Timestamp created =
                        rs.getTimestamp("created_at");

                Timestamp updated =
                        rs.getTimestamp("updated_at");

                if (created != null) {
                    note.setCreatedAt(
                            created.toLocalDateTime()
                    );
                }

                if (updated != null) {
                    note.setUpdatedAt(
                            updated.toLocalDateTime()
                    );
                }

                return note;
            };

    private String serializeChecklist(Note note) {

        try {

            if (note.getChecklistItems() == null) {
                return "[]";
            }

            return objectMapper.writeValueAsString(
                    note.getChecklistItems()
            );

        } catch (JsonProcessingException e) {

            return "[]";
        }
    }

    private List<Note.ChecklistItem> deserializeChecklist(
            String json) {

        if (json == null || json.isBlank()) {
            return new ArrayList<>();
        }

        try {

            return objectMapper.readValue(
                    json,
                    new TypeReference<
                            List<Note.ChecklistItem>>() {}
            );

        } catch (Exception e) {

            return new ArrayList<>();
        }
    }
}