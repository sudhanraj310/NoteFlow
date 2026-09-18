package com.example.notes.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Note {

    private Integer noteId;
    private Integer userId;
    private String title;
    private String content;
    private String category;
    private String noteType;
    private boolean pinned;
    private List<ChecklistItem> checklistItems = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Note() {
    }

    public Note(Integer noteId, Integer userId, String title,
                String content, String category, String noteType,
                boolean pinned, List<ChecklistItem> checklistItems,
                LocalDateTime createdAt, LocalDateTime updatedAt) {

        this.noteId = noteId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.category = category;
        this.noteType = noteType;
        this.pinned = pinned;
        this.checklistItems =
                checklistItems == null
                        ? new ArrayList<>()
                        : checklistItems;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getNoteId() {
        return noteId;
    }

    public void setNoteId(Integer noteId) {
        this.noteId = noteId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getNoteType() {
        return noteType;
    }

    public void setNoteType(String noteType) {
        this.noteType = noteType;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public List<ChecklistItem> getChecklistItems() {
        return checklistItems;
    }

    public void setChecklistItems(
            List<ChecklistItem> checklistItems) {

        this.checklistItems =
                checklistItems == null
                        ? new ArrayList<>()
                        : checklistItems;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static class ChecklistItem {

        private String text;
        private boolean checked;

        public ChecklistItem() {
        }

        public ChecklistItem(String text, boolean checked) {
            this.text = text;
            this.checked = checked;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public boolean isChecked() {
            return checked;
        }

        public void setChecked(boolean checked) {
            this.checked = checked;
        }
    }
}