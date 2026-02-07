document.addEventListener("DOMContentLoaded", () => {

  /* ================= ELEMENT ================= */
  const sections = document.querySelectorAll(".section");
  const form = document.getElementById("todoForm");
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const taskError = document.getElementById("taskError");
  const dateError = document.getElementById("dateError");
  const list = document.getElementById("todoList");
  const filter = document.getElementById("filter");
  const deleteAll = document.getElementById("deleteAll");
  const progress = document.getElementById("progress");
  const counter = document.getElementById("counter");
  const motivation = document.getElementById("motivation");

  const noteForm = document.getElementById("noteForm");
  const noteInput = document.getElementById("noteInput");
  const noteList = document.getElementById("noteList");

  if (!form || !list || !noteForm) return;

  /* ================= DATA ================= */
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  /* ================= MOTIVATION ================= */
  const messages = [
    "You’re closer than you think 💪",
    "Small progress is still progress 🌱",
    "Discipline beats motivation 🔥",
    "Finish strong today 🚀"
  ];
  if (motivation) {
    motivation.textContent = messages[Math.floor(Math.random() * messages.length)];
  }

  /* ================= SECTION REVEAL ================= */
  function reveal() {
    const trigger = window.innerHeight - 100;
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top < trigger) {
        sec.classList.add("show");
      }
    });
  }
  window.addEventListener("scroll", reveal);
  reveal();

  /* ================= ADD TODO ================= */
  form.addEventListener("submit", e => {
    e.preventDefault();
    taskError.textContent = "";
    dateError.textContent = "";

    if (!taskInput.value.trim()) {
      taskError.textContent = "Task wajib diisi";
      return;
    }
    if (!dateInput.value) {
      dateError.textContent = "Tanggal wajib diisi";
      return;
    }

    todos.push({
      id: Date.now(),
      task: taskInput.value.trim(),
      date: dateInput.value,
      completed: false
    });

    taskInput.value = "";
    dateInput.value = "";

    saveTodos();
    renderTodos();
  });

  /* ================= FILTER ================= */
  if (filter) {
    filter.addEventListener("change", renderTodos);
  }

  /* ================= DELETE ALL ================= */
  if (deleteAll) {
    deleteAll.addEventListener("click", () => {
      if (!confirm("Delete all tasks?")) return;
      todos = [];
      saveTodos();
      renderTodos();
    });
  }

  /* ================= RENDER TODOS ================= */
  function renderTodos() {
    list.innerHTML = "";

    let data = [...todos];
    if (filter && filter.value === "completed") {
      data = data.filter(t => t.completed);
    }
    if (filter && filter.value === "uncompleted") {
      data = data.filter(t => !t.completed);
    }

    if (!data.length) {
      list.innerHTML = "<tr><td colspan='5'>✨ No task yet</td></tr>";
      updateProgress();
      return;
    }

    data.forEach(todo => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" ${todo.completed ? "checked" : ""}></td>
        <td class="${todo.completed ? "completed" : ""}">${todo.task}</td>
        <td>${todo.date}</td>
        <td>${todo.completed ? "✅ Done" : "⏳ Pending"}</td>
        <td>
          <button class="icon-btn edit">✏️</button>
          <button class="icon-btn delete">🗑</button>
        </td>
      `;

      tr.querySelector("input").addEventListener("change", () => {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
      });

      tr.querySelector(".delete").addEventListener("click", () => {
        if (!confirm("Delete this task?")) return;
        todos = todos.filter(t => t.id !== todo.id);
        saveTodos();
        renderTodos();
      });

      tr.querySelector(".edit").addEventListener("click", () => {
        const edit = prompt("Edit task:", todo.task);
        if (!edit || !edit.trim()) return;
        todo.task = edit.trim();
        saveTodos();
        renderTodos();
      });

      list.appendChild(tr);
    });

    updateProgress();
  }

  /* ================= PROGRESS ================= */
  function updateProgress() {
    const done = todos.filter(t => t.completed).length;
    const total = todos.length;
    counter.textContent = `${done}/${total}`;
    progress.style.width = total ? (done / total) * 100 + "%" : "0%";
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  /* ================= NOTES ================= */
  noteForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!noteInput.value.trim()) return;

    notes.push({ text: noteInput.value.trim() });
    noteInput.value = "";
    saveNotes();
    renderNotes();
  });

  function renderNotes() {
    noteList.innerHTML = "";
    if (!notes.length) {
      noteList.innerHTML = "<p>✨ No notes yet</p>";
      return;
    }

    notes.forEach((n, i) => {
      const div = document.createElement("div");
      div.className = "note-card";
      div.innerHTML = `
        <p>${n.text}</p>
        <div class="note-actions">
          <button class="edit">✏️</button>
          <button class="delete">🗑</button>
        </div>
      `;

      div.querySelector(".edit").addEventListener("click", () => {
        const edit = prompt("Edit note:", n.text);
        if (!edit || !edit.trim()) return;
        notes[i].text = edit.trim();
        saveNotes();
        renderNotes();
      });

      div.querySelector(".delete").addEventListener("click", () => {
        if (!confirm("Delete this note?")) return;
        notes.splice(i, 1);
        saveNotes();
        renderNotes();
      });

      noteList.appendChild(div);
    });
  }

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  /* ================= INIT ================= */
  renderTodos();
  renderNotes();

});