-- ==============================
-- USERS TABLE
-- ==============================

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==============================
-- NOTES TABLE
-- ==============================

CREATE TABLE IF NOT EXISTS notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(200) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    note_type VARCHAR(20) NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    checklist_items TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- ==============================
-- DEMO USER
-- ==============================

INSERT INTO users (username, password)
SELECT 'demo', 'demo123'
WHERE NOT EXISTS (
    SELECT 1
    FROM users
    WHERE username = 'demo'
);


-- ==============================
-- DEMO NOTES
-- ==============================

INSERT INTO notes
(
    user_id,
    title,
    content,
    category,
    note_type,
    is_pinned,
    checklist_items
)
SELECT
    user_id,
    'Welcome to NoteFlow',
    'This is your personal space for capturing ideas, planning work, and keeping your thoughts organized.',
    'Personal',
    'TEXT',
    TRUE,
    '[]'
FROM users
WHERE username = 'demo'
AND NOT EXISTS (
    SELECT 1
    FROM notes
    WHERE title = 'Welcome to NoteFlow'
);


INSERT INTO notes
(
    user_id,
    title,
    content,
    category,
    note_type,
    is_pinned,
    checklist_items
)
SELECT
    user_id,
    'Java project roadmap',
    'Sketch the API endpoints, complete the data model, then prepare your final demo.',
    'College',
    'TEXT',
    FALSE,
    '[]'
FROM users
WHERE username = 'demo'
AND NOT EXISTS (
    SELECT 1
    FROM notes
    WHERE title = 'Java project roadmap'
);