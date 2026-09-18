CREATE DATABASE IF NOT EXISTS notes_db;
USE notes_db;

CREATE TABLE IF NOT EXISTS notes (
    note_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    note_type VARCHAR(20) NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    checklist_items JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notes (title, content, category, note_type, is_pinned, checklist_items) VALUES
('Welcome to NoteFlow', 'This is your personal space for capturing ideas, planning work, and keeping your thoughts organized.', 'Personal', 'TEXT', TRUE, JSON_ARRAY()),
('Java project roadmap', 'Sketch the API endpoints, complete the data model, then prepare your final demo.', 'College', 'TEXT', FALSE, JSON_ARRAY()),
('This week''s priorities', '', 'Projects', 'CHECKLIST', FALSE, JSON_ARRAY(
    JSON_OBJECT('text', 'Review project brief', 'checked', TRUE),
    JSON_OBJECT('text', 'Prepare the milestone update', 'checked', FALSE),
    JSON_OBJECT('text', 'Block focus time', 'checked', FALSE)
)),
('Ideas to explore', 'A lightweight study planner, a reading tracker, and a weekly reflection ritual.', 'Ideas', 'TEXT', FALSE, JSON_ARRAY());
