const API_BASE = "https://noteflow-u0vy.onrender.com/api/notes";
const AUTH_BASE = "https://noteflow-u0vy.onrender.com/api/auth";

const state = {
  allNotes: [],
  searchResults: null,
  currentSearch: "",
  activeFilter: "all",
  editingNoteId: null,
  viewingNote: null,
  noteToDelete: null,
  searchRequest: 0,
  deferredInstallPrompt: null
};

const elements = {
  sidebar: document.querySelector("#sidebar"),
  navOverlay: document.querySelector("#nav-overlay"),
  notesGrid: document.querySelector("#notes-grid"),
  loading: document.querySelector("#loading-state"),
  error: document.querySelector("#error-state"),
  empty: document.querySelector("#empty-state"),
  searchInput: document.querySelector("#search-input"),
  clearSearch: document.querySelector("#clear-search"),
  resultSummary: document.querySelector("#result-summary"),
  pageTitle: document.querySelector("#page-title"),
  notesHeading: document.querySelector("#notes-heading"),
  notesSubheading: document.querySelector("#notes-subheading"),
  noteModal: document.querySelector("#note-modal"),
  viewModal: document.querySelector("#view-modal"),
  deleteModal: document.querySelector("#delete-modal"),
  noteForm: document.querySelector("#note-form"),
  noteId: document.querySelector("#note-id"),
  noteTitle: document.querySelector("#note-title"),
  noteCategory: document.querySelector("#note-category"),
  noteType: document.querySelector("#note-type"),
  noteContent: document.querySelector("#note-content"),
  contentField: document.querySelector("#content-field"),
  checklistEditor: document.querySelector("#checklist-editor"),
  checklistItems: document.querySelector("#checklist-items"),
  notePinned: document.querySelector("#note-pinned"),
  modalTitle: document.querySelector("#modal-title"),
  modalEyebrow: document.querySelector("#modal-eyebrow"),
  saveButton: document.querySelector("#save-note-button"),
  viewTitle: document.querySelector("#view-title"),
  viewCategory: document.querySelector("#view-category"),
  viewBody: document.querySelector("#view-body"),
  viewMeta: document.querySelector("#view-meta"),
  viewEdit: document.querySelector("#view-edit-button"),
  toastRegion: document.querySelector("#toast-region"),
  installButton: document.querySelector("#install-button"),
  authScreen: document.querySelector("#auth-screen"),
  logoutButton: document.querySelector("#logout-button"),
  themeToggle: document.querySelector("#theme-toggle"),
  loginForm: document.querySelector("#login-form"),
  loginUsername: document.querySelector("#login-username"),
  loginPassword: document.querySelector("#login-password"),
  loginError: document.querySelector("#login-error"),
  showRegisterButton: document.querySelector("#show-register-button"),
  registerScreen: document.querySelector("#register-screen"),
  registerForm: document.querySelector("#register-form"),
  registerUsername: document.querySelector("#register-username"),
  registerPassword: document.querySelector("#register-password"),
  registerError: document.querySelector("#register-error"),
  backToLoginButton: document.querySelector("#back-to-login-button")
};

async function logout() {
  await fetch(`${AUTH_BASE}/logout`, {
    method: "POST"
  });

  window.location.reload();
}

async function api(path = "", options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const raw = await response.text();
  let data = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Something went wrong. Please try again.");
  }
  return data;
}
async function login(username, password) {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });
  async function register(username, password) {
  const response = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}
  async function register(username, password) {
  const response = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });
  elements.showRegisterButton.addEventListener("click", () => {
  elements.loginForm.reset();
  elements.loginError.textContent = "";

  elements.loginForm.querySelector("button[type='submit']").textContent =
    "Create Account";
});
elements.registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = elements.registerUsername.value.trim();
  const password = elements.registerPassword.value;

  elements.registerError.textContent = "";

  try {
    await register(username, password);

    alert("Account created successfully! Please login.");

    elements.registerForm.hidden = true;
    elements.loginForm.hidden = false;
    elements.loginForm.reset();
  } catch (error) {
    elements.registerError.textContent = error.message;
  }
});

  const raw = await response.text();

  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Registration failed"
    );
  }

  return data;
}

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
}

async function checkLogin() {
  try {
    const response = await fetch(`${AUTH_BASE}/me`);

    if (!response.ok) {
      throw new Error("Not logged in");
    }

    elements.authScreen.hidden = true;
    await loadNotes();
  } catch {
    elements.authScreen.hidden = false;
  }
}

elements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = elements.loginUsername.value.trim();
  const password = elements.loginPassword.value;

  elements.loginError.textContent = "";

  try {
    await login(username, password);
    elements.authScreen.hidden = true;
    await loadNotes();
  } catch (error) {
    elements.loginError.textContent = error.message;
  }
});
elements.showRegisterButton.addEventListener("click", () => {
  elements.authScreen.hidden = true;
  elements.registerScreen.hidden = false;
  elements.registerError.textContent = "";
});
elements.registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = elements.registerUsername.value.trim();
  const password = elements.registerPassword.value;

  elements.registerError.textContent = "";

  try {
    await register(username, password);

    alert("Account created successfully!");

    elements.registerForm.reset();
    elements.registerScreen.hidden = true;
    elements.authScreen.hidden = false;

  } catch (error) {
    elements.registerError.textContent = error.message;
  }
});
elements.backToLoginButton.addEventListener("click", () => {
  elements.registerScreen.hidden = true;
  elements.authScreen.hidden = false;
  elements.registerError.textContent = "";
  elements.registerForm.reset();
});

elements.logoutButton.addEventListener("click", async () => {
  try {
    await logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
});

function getSourceNotes() {
  return state.searchResults === null ? state.allNotes : state.searchResults;
}

function getFilteredNotes() {
  const notes = [...getSourceNotes()];
  const filtered = notes.filter(note => {
    if (state.activeFilter === "all") return true;
    if (state.activeFilter === "pinned") return note.pinned;
    if (state.activeFilter === "checklist") return note.noteType === "CHECKLIST";
    return note.category === state.activeFilter;
  });
  return filtered.sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt) - new Date(a.updatedAt));
}

async function loadNotes(showLoader = true) {
  if (showLoader) setLoading(true);
  hideStates();
  try {
    state.allNotes = await api();
    updateStatistics();
    renderNotes();
  } catch (error) {
    elements.notesGrid.innerHTML = "";
    elements.error.hidden = false;
    showToast(error.message || "Unable to load your notes.", "error");
  } finally {
    setLoading(false);
  }
}

function renderNotes() {
  hideStates();
  const notes = getFilteredNotes();
  const searching = state.searchResults !== null;
  updateSectionCopy(notes.length, searching);

  if (notes.length === 0) {
    elements.notesGrid.innerHTML = "";
    document.querySelector("#empty-title").textContent = searching ? "No matching notes" : state.activeFilter === "all" ? "No notes yet" : `No ${filterLabel(state.activeFilter).toLowerCase()} notes`;
    document.querySelector("#empty-copy").textContent = searching ? "Try another word, or clear the search to see all of your notes." : state.activeFilter === "all" ? "Start with an idea, a plan, or a checklist." : "Try another collection, or create a note for this one.";
    document.querySelector("#empty-create-button").hidden = searching;
    elements.empty.hidden = false;
    return;
  }

  elements.notesGrid.innerHTML = notes.map((note, index) => noteCard(note, index)).join("");
}

function noteCard(note, index) {
  const isChecklist = note.noteType === "CHECKLIST";
  const type = isChecklist ? '<i class="fa-solid fa-list-check"></i> Checklist' : '<i class="fa-regular fa-file-lines"></i> Text';
  const preview = isChecklist ? checklistPreview(note.checklistItems || []) : `<p class="content-preview">${escapeHtml(note.content || "No content added yet.")}</p>`;
  return `<article class="note-card" style="animation-delay:${Math.min(index * 35, 250)}ms">
    <div class="card-top">
      <div class="card-badges"><span class="category-badge category-${escapeHtml(note.category)}">${escapeHtml(note.category)}</span><span class="type-badge">${type}</span></div>
      <button class="card-pin ${note.pinned ? "is-pinned" : ""}" data-action="pin" data-note-id="${note.noteId}" aria-label="${note.pinned ? "Unpin" : "Pin"} ${escapeHtml(note.title)}" title="${note.pinned ? "Unpin note" : "Pin note"}"><i class="fa-solid fa-thumbtack"></i></button>
    </div>
    <h3>${escapeHtml(note.title)}</h3>
    ${preview}
    <footer class="card-footer"><span class="date-label">${dateLabel(note.updatedAt)}</span><div class="card-actions">
      <button class="card-action" data-action="view" data-note-id="${note.noteId}" aria-label="View ${escapeHtml(note.title)}" title="View"><i class="fa-regular fa-eye"></i></button>
      <button class="card-action" data-action="edit" data-note-id="${note.noteId}" aria-label="Edit ${escapeHtml(note.title)}" title="Edit"><i class="fa-solid fa-pen"></i></button>
      <button class="card-action delete" data-action="delete" data-note-id="${note.noteId}" aria-label="Delete ${escapeHtml(note.title)}" title="Delete"><i class="fa-regular fa-trash-can"></i></button>
    </div></footer>
  </article>`;
}

function checklistPreview(items) {
  if (!items.length) return '<p class="content-preview">No checklist items yet.</p>';
  return `<div class="checklist-preview">${items.slice(0, 2).map(item => `<span class="checklist-preview-item ${item.checked ? "complete" : ""}"><i class="${item.checked ? "fa-solid fa-circle-check" : "fa-regular fa-circle"}"></i>${escapeHtml(item.text)}</span>`).join("")}${items.length > 2 ? `<span class="checklist-preview-item">+ ${items.length - 2} more item${items.length - 2 === 1 ? "" : "s"}</span>` : ""}</div>`;
}

async function createNote(payload) {
  return api("", { method: "POST", body: JSON.stringify(payload) });
}

async function updateNote(id, payload) {
  return api(`/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

function requestDelete(note) {
  state.noteToDelete = note;
  openModal(elements.deleteModal);
}

async function deleteNote() {
  const note = state.noteToDelete;
  if (!note) return;
  const deleteButton = document.querySelector("#confirm-delete-button");
  deleteButton.disabled = true;
  try {
    await api(`/${note.noteId}`, { method: "DELETE" });
    closeModal(elements.deleteModal);
    state.noteToDelete = null;
    showToast("Note deleted successfully");
    await refreshCurrentView();
  } catch (error) {
    showToast(error.message || "Could not delete the note.", "error");
  } finally {
    deleteButton.disabled = false;
  }
}

function viewNote(note) {
  state.viewingNote = note;
  elements.viewCategory.textContent = note.category.toUpperCase();
  elements.viewTitle.textContent = note.title;
  if (note.noteType === "CHECKLIST") {
    elements.viewBody.className = "view-body";
    elements.viewBody.innerHTML = `<div class="view-checklist">${(note.checklistItems || []).map((item, index) => `<button class="view-check-item ${item.checked ? "is-checked" : ""}" data-view-item="${index}" title="Mark ${item.checked ? "incomplete" : "complete"}"><span class="check-mark"><i class="fa-solid fa-check"></i></span><span>${escapeHtml(item.text)}</span></button>`).join("")}</div>`;
  } else {
    elements.viewBody.className = `view-body ${note.content ? "" : "empty-content"}`;
    elements.viewBody.textContent = note.content || "No content added to this note.";
  }
  elements.viewMeta.innerHTML = `<span><i class="fa-regular fa-file-lines"></i>${note.noteType === "CHECKLIST" ? "Checklist" : "Text note"}</span><span><i class="fa-regular fa-calendar"></i>Created ${formatDate(note.createdAt)}</span><span><i class="fa-regular fa-clock"></i>Updated ${formatDate(note.updatedAt)}</span>${note.pinned ? '<span class="pinned-meta"><i class="fa-solid fa-thumbtack"></i>Pinned</span>' : ""}`;
  openModal(elements.viewModal);
}

async function togglePin(id) {
  try {
    const updatedNote = await api(`/${id}/pin`, { method: "PUT" });
    replaceNote(updatedNote);
    updateStatistics();
    renderNotes();
    if (state.viewingNote?.noteId === id) viewNote(updatedNote);
    showToast(updatedNote.pinned ? "Note pinned" : "Note unpinned");
  } catch (error) {
    showToast(error.message || "Could not update the pin.", "error");
  }
}

async function searchNotes(keyword = elements.searchInput.value) {
  const query = keyword.trim();
  state.currentSearch = query;
  elements.clearSearch.hidden = !query;
  const request = ++state.searchRequest;
  if (!query) {
    state.searchResults = null;
    renderNotes();
    return;
  }
  elements.resultSummary.textContent = "Searching…";
  try {
    const result = await api(`/search?keyword=${encodeURIComponent(query)}`);
    if (request !== state.searchRequest) return;
    state.searchResults = result;
    renderNotes();
  } catch (error) {
    if (request === state.searchRequest) showToast(error.message || "Search is unavailable.", "error");
  }
}

function filterNotes(filter) {
  state.activeFilter = filter;
  document.querySelectorAll(".nav-item[data-filter]").forEach(button => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
  });
  renderNotes();
  closeNavigation();
}

function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  const focusTarget = modal.querySelector("input:not([type=hidden]), button, textarea, select");
  setTimeout(() => focusTarget?.focus(), 30);
}

function closeModal(modal) {
  modal.hidden = true;
  if ([elements.noteModal, elements.viewModal, elements.deleteModal].every(item => item.hidden)) {
    document.body.style.overflow = "";
  }
}

function openCreateModal() {
  state.editingNoteId = null;
  elements.noteForm.reset();
  elements.noteId.value = "";
  elements.noteType.value = "TEXT";
  elements.modalEyebrow.textContent = "CREATE";
  elements.modalTitle.textContent = "New note";
  elements.saveButton.querySelector("span").textContent = "Create note";
  clearFormErrors();
  renderChecklist([]);
  toggleNoteType();
  openModal(elements.noteModal);
}

function openEditModal(note) {
  closeModal(elements.viewModal);
  state.editingNoteId = note.noteId;
  elements.noteId.value = note.noteId;
  elements.noteTitle.value = note.title;
  elements.noteCategory.value = note.category;
  elements.noteType.value = note.noteType;
  elements.noteContent.value = note.content || "";
  elements.notePinned.checked = note.pinned;
  elements.modalEyebrow.textContent = "EDIT";
  elements.modalTitle.textContent = "Edit note";
  elements.saveButton.querySelector("span").textContent = "Save changes";
  clearFormErrors();
  renderChecklist(note.checklistItems || []);
  toggleNoteType();
  openModal(elements.noteModal);
}

function toggleNoteType() {
  const checklist = elements.noteType.value === "CHECKLIST";
  elements.contentField.hidden = checklist;
  elements.checklistEditor.hidden = !checklist;
  if (checklist && !elements.checklistItems.children.length) addChecklistItem();
}

function addChecklistItem(item = { text: "", checked: false }) {
  const values = getChecklistEditorItems();
  values.push(item);
  renderChecklist(values);
  const lastInput = elements.checklistItems.querySelector(".checklist-text:last-of-type");
  lastInput?.focus();
}

function removeChecklistItem(index) {
  const values = getChecklistEditorItems();
  values.splice(index, 1);
  renderChecklist(values);
}

function renderChecklist(items) {
  elements.checklistItems.innerHTML = items.map((item, index) => `<div class="checklist-item-input"><button type="button" class="editor-check ${item.checked ? "is-checked" : ""}" data-editor-check="${index}" aria-label="Mark checklist item ${index + 1} ${item.checked ? "incomplete" : "complete"}"><i class="fa-solid fa-check"></i></button><input class="checklist-text" type="text" value="${escapeAttribute(item.text || "")}" placeholder="Checklist item ${index + 1}" aria-label="Checklist item ${index + 1}"><button type="button" class="remove-item-button" data-remove-item="${index}" aria-label="Remove checklist item ${index + 1}"><i class="fa-solid fa-xmark"></i></button></div>`).join("");
}

function getChecklistEditorItems() {
  return [...elements.checklistItems.querySelectorAll(".checklist-item-input")].map(row => ({
    text: row.querySelector(".checklist-text").value,
    checked: row.querySelector(".editor-check").classList.contains("is-checked")
  }));
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "error" : ""}`;
  toast.innerHTML = `<i class="fa-solid ${type === "error" ? "fa-circle-exclamation" : "fa-circle-check"}"></i><span>${escapeHtml(message)}</span>`;
  elements.toastRegion.append(toast);
  setTimeout(() => {
    toast.classList.add("out");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, 3600);
}

function updateStatistics() {
  const total = state.allNotes.length;
  const pinned = state.allNotes.filter(note => note.pinned).length;
  const checklist = state.allNotes.filter(note => note.noteType === "CHECKLIST").length;
  document.querySelector("#stat-total").textContent = total;
  document.querySelector("#stat-pinned").textContent = pinned;
  document.querySelector("#stat-checklist").textContent = checklist;
  document.querySelector("#all-count").textContent = total;
  document.querySelector("#pinned-count").textContent = pinned;
}

async function refreshCurrentView() {
  await loadNotes(false);
  if (state.currentSearch) await searchNotes(state.currentSearch);
}

function replaceNote(updated) {
  state.allNotes = state.allNotes.map(note => note.noteId === updated.noteId ? updated : note);
  if (state.searchResults !== null) state.searchResults = state.searchResults.map(note => note.noteId === updated.noteId ? updated : note);
  state.viewingNote = updated;
}

function updateSectionCopy(count, searching) {
  const label = filterLabel(state.activeFilter);
  elements.pageTitle.textContent = searching ? "Search results" : label === "All notes" ? "Your notes" : label;
  elements.notesHeading.textContent = searching ? `Results for “${state.currentSearch}”` : label;
  elements.notesSubheading.textContent = searching ? `${count} matching note${count === 1 ? "" : "s"} found.` : state.activeFilter === "all" ? "Your most recently updated thoughts." : `Notes in your ${label.toLowerCase()} collection.`;
  elements.resultSummary.textContent = `${count} note${count === 1 ? "" : "s"}`;
}

function filterLabel(filter) {
  return ({ all: "All notes", pinned: "Pinned notes", checklist: "Checklist notes" })[filter] || filter;
}

function setLoading(loading) {
  elements.loading.hidden = !loading;
  if (loading) elements.notesGrid.innerHTML = "";
}

function hideStates() {
  elements.error.hidden = true;
  elements.empty.hidden = true;
}

function clearFormErrors() {
  document.querySelectorAll(".field-error").forEach(item => item.textContent = "");
}

function displayFormError(id, message) {
  document.querySelector(id).textContent = message;
}

function validateForm(payload) {
  clearFormErrors();
  let valid = true;
  if (!payload.title.trim()) { displayFormError("#title-error", "Please give your note a title."); valid = false; }
  if (!payload.category) { displayFormError("#category-error", "Please choose a category."); valid = false; }
  if (payload.noteType === "CHECKLIST") {
    if (!payload.checklistItems.length || payload.checklistItems.some(item => !item.text.trim())) {
      displayFormError("#checklist-error", "Add at least one checklist item and make sure none are empty."); valid = false;
    }
  }
  return valid;
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(parseLocalDate(value));
}

function dateLabel(value) {
  const date = parseLocalDate(value);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((startToday - startDate) / 86400000);
  if (days === 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days >= 0 && days < 7) return `Updated ${days} days ago`;
  return `Updated ${new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(date)}`;
}

function parseLocalDate(value) {
  return new Date(typeof value === "string" && !value.endsWith("Z") ? value.replace(" ", "T") : value);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function escapeAttribute(value) { return escapeHtml(value); }

function closeNavigation() {
  elements.sidebar.classList.remove("open");
  elements.navOverlay.classList.remove("visible");
}

function toggleEditorCheck(button) {
  button.classList.toggle("is-checked");
  const index = Number(button.dataset.editorCheck) + 1;
  button.setAttribute("aria-label", `Mark checklist item ${index} ${button.classList.contains("is-checked") ? "incomplete" : "complete"}`);
}

async function toggleViewedChecklistItem(index) {
  const note = state.viewingNote;
  if (!note) return;
  const checklistItems = note.checklistItems.map((item, itemIndex) => itemIndex === index ? { ...item, checked: !item.checked } : item);
  const payload = { title: note.title, content: note.content || "", category: note.category, noteType: note.noteType, pinned: note.pinned, checklistItems };
  try {
    const updated = await updateNote(note.noteId, payload);
    replaceNote(updated);
    viewNote(updated);
    renderNotes();
    showToast("Checklist updated");
  } catch (error) {
    showToast(error.message || "Could not update the checklist.", "error");
  }
}

function initializeEvents() {
  document.querySelector("#new-note-button").addEventListener("click", openCreateModal);
  document.querySelector("#empty-create-button").addEventListener("click", openCreateModal);
  document.querySelector("#refresh-button").addEventListener("click", refreshCurrentView);
  document.querySelector("#retry-button").addEventListener("click", () => loadNotes());
  document.querySelector("#open-nav").addEventListener("click", () => { elements.sidebar.classList.add("open"); elements.navOverlay.classList.add("visible"); });
  document.querySelector("#close-nav").addEventListener("click", closeNavigation);
  elements.navOverlay.addEventListener("click", closeNavigation);
  elements.installButton.addEventListener("click", installApp);

  document.querySelectorAll(".nav-item[data-filter]").forEach(button => button.addEventListener("click", () => filterNotes(button.dataset.filter)));
  elements.searchInput.addEventListener("input", () => {
    clearTimeout(elements.searchInput.searchTimer);
    elements.searchInput.searchTimer = setTimeout(() => searchNotes(), 280);
  });
  elements.clearSearch.addEventListener("click", () => { elements.searchInput.value = ""; searchNotes(""); elements.searchInput.focus(); });

  elements.notesGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const id = Number(button.dataset.noteId);
    const note = getSourceNotes().find(item => item.noteId === id) || state.allNotes.find(item => item.noteId === id);
    if (!note) return;
    if (button.dataset.action === "view") viewNote(note);
    if (button.dataset.action === "edit") openEditModal(note);
    if (button.dataset.action === "delete") requestDelete(note);
    if (button.dataset.action === "pin") togglePin(id);
  });

  elements.noteType.addEventListener("change", toggleNoteType);
  document.querySelector("#add-checklist-item").addEventListener("click", () => addChecklistItem());
  elements.checklistItems.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove-item]");
    const checkButton = event.target.closest("[data-editor-check]");
    if (removeButton) removeChecklistItem(Number(removeButton.dataset.removeItem));
    if (checkButton) toggleEditorCheck(checkButton);
  });

  elements.noteForm.addEventListener("submit", async event => {
    event.preventDefault();
    const payload = { title: elements.noteTitle.value, content: elements.noteContent.value, category: elements.noteCategory.value, noteType: elements.noteType.value, pinned: elements.notePinned.checked, checklistItems: elements.noteType.value === "CHECKLIST" ? getChecklistEditorItems() : [] };
    if (!validateForm(payload)) return;
    elements.saveButton.disabled = true;
    try {
      const isEdit = Boolean(state.editingNoteId);
      await (isEdit ? updateNote(state.editingNoteId, payload) : createNote(payload));
      closeModal(elements.noteModal);
      showToast(isEdit ? "Note updated successfully" : "Note created successfully");
      await refreshCurrentView();
    } catch (error) {
      showToast(error.message || "Could not save the note.", "error");
    } finally {
      elements.saveButton.disabled = false;
    }
  });

  document.querySelector("#confirm-delete-button").addEventListener("click", deleteNote);
  elements.viewEdit.addEventListener("click", () => state.viewingNote && openEditModal(state.viewingNote));
  elements.viewBody.addEventListener("click", event => {
    const button = event.target.closest("[data-view-item]");
    if (button) toggleViewedChecklistItem(Number(button.dataset.viewItem));
  });

  document.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", () => closeModal(button.closest(".modal-backdrop"))));
  [elements.noteModal, elements.viewModal, elements.deleteModal].forEach(modal => modal.addEventListener("click", event => { if (event.target === modal) closeModal(modal); }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      [elements.noteModal, elements.viewModal, elements.deleteModal].filter(modal => !modal.hidden).forEach(closeModal);
      closeNavigation();
    }
  });
}

async function installApp() {
  if (state.deferredInstallPrompt) {
    state.deferredInstallPrompt.prompt();
    const choice = await state.deferredInstallPrompt.userChoice;
    if (choice.outcome === "accepted") showToast("NoteFlow is installing");
    state.deferredInstallPrompt = null;
    elements.installButton.hidden = true;
    return;
  }
  showToast("Use your browser menu and choose “Add to Home Screen” to install NoteFlow.");
}

function initializePwa() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("/service-worker.js").catch(() => {}));
  }
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    elements.installButton.hidden = false;
  });
  window.addEventListener("appinstalled", () => {
    state.deferredInstallPrompt = null;
    elements.installButton.hidden = true;
    showToast("NoteFlow is installed and ready to use");
  });
}

function setGreeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  document.querySelector("#greeting-time").innerHTML = `${greeting} <span aria-hidden="true">👋</span>`;
}

initializeEvents();
initializePwa();
setGreeting();
checkLogin();
async function register(username, password) {
  const response = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  const raw = await response.text();

  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Registration failed"
    );
  }

  return data;
}

// Theme toggle
function updateThemeButton() {
  const isDark = document.body.classList.contains("dark-theme");

  elements.themeToggle.innerHTML = isDark
    ? '<i class="fa-solid fa-sun"></i><span>Light Mode</span>'
    : '<i class="fa-solid fa-moon"></i><span>Dark Mode</span>';
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-theme");

  localStorage.setItem("noteflow-theme", isDark ? "dark" : "light");

  updateThemeButton();
}

elements.themeToggle.addEventListener("click", toggleTheme);

// Load saved theme
if (localStorage.getItem("noteflow-theme") === "dark") {
  document.body.classList.add("dark-theme");
}

updateThemeButton();