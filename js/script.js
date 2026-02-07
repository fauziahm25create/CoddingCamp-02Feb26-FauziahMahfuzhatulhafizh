document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded successfully"); 

  const sections = document.querySelectorAll(".section");
  console.log("Sections found:", sections.length);

  const form = document.getElementById("todoForm");
  const taskInput = document.getElementById("taskInput");
  const dateInput = document.getElementById("dateInput");
  const taskError = document.getElementById("taskError");
  const dateError = document.getElementById("dateError");
  const list = document.getElementById("todoList");
  const filter = document.getElementById("filter");
  const deleteAll = document.getElementById("deleteAll");
  const deleteSelected = document.getElementById("deleteSelected");
  const selectAll = document.getElementById("selectAll");
  const progress = document.getElementById("progress");
  const counter = document.getElementById("counter");
  const motivation = document.getElementById("motivation");

  const noteForm = document.getElementById("noteForm");
  const noteInput = document.getElementById("noteInput");
  const noteList = document.getElementById("noteList");
  const deleteSelectedNotes = document.getElementById("deleteSelectedNotes");

  if (!form || !list || !noteForm) {
    console.error("Form, list, or noteForm not found");
    return;
  }

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let notes = JSON.parse(localStorage.getItem("notes")) || [];

  const messages = [
    "You’re closer than you think 💪",
    "Small progress is still progress 🌱",
    "Discipline beats motivation 🔥",
    "Finish strong today 🚀"
  ];
  if (motivation) {
    motivation.textContent = messages[Math.floor(Math.random() * messages.length)];
  }

  function reveal() {
    console.log("Reveal function called");
    const trigger = window.innerHeight - 100;
    sections.forEach((sec, index) => {
      if (sec.getBoundingClientRect().top < trigger) {
        sec.classList.add("show");
        console.log(`Section ${index} shown`);
      }
    });
  }
  window.addEventListener("scroll", reveal);
  reveal();

  setTimeout(() => {
    sections.forEach(sec => {
      if (!sec.classList.contains("show")) {
        sec.classList.add("show");
        console.log("Fallback: Forced section to show");
      }
    });
  }, 1000);

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
      completed: false,
      selected: false
    });

    taskInput.value = "";
    dateInput.value = "";

    saveTodos();
    renderTodos();
  });

  if (filter) {
    filter.addEventListener("change", renderTodos);
  }

  if (selectAll) {
    selectAll.addEventListener("change", () => {
      const checkboxes = list.querySelectorAll('input[type="checkbox"]:not(#selectAll)');
      checkboxes.forEach(cb => cb.checked = selectAll.checked);
      todos.forEach(todo => todo.selected = selectAll.checked);
    });
  }

  if (deleteSelected) {
    deleteSelected.addEventListener("click", () => {
      const selectedIds = todos.filter(t => t.selected).map(t => t.id);
      if (!selectedIds.length) return alert("No tasks selected");
      if (!confirm("Delete selected tasks?")) return;
      todos = todos.filter(t => !selectedIds.includes(t.id));
      saveTodos();
      renderTodos();
    });
  }

  if (deleteAll) {
    deleteAll.addEventListener("click", () => {
      if (!confirm("Delete all tasks?")) return;
      todos = [];
      saveTodos();
      renderTodos();
    });
  }

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
      list.innerHTML = "<tr><td colspan='6'>✨ No task yet</td></tr>";
      updateProgress();
      return;
    }

    data.forEach(todo => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox" class="select-checkbox" ${todo.selected ? "checked" : ""}></td>
        <td><input type="checkbox" class="done-checkbox" ${todo.completed ? "checked" : ""}></td>
        <td class="${todo.completed ? "completed" : ""}">${todo.task}</td>
        <td>${todo.date}</td>
        <td>${todo.completed ? "✅ Done" : "⏳ Pending"}</td>
        <td>
          <button class="icon-btn edit">✏️</button>
          <button class="icon-btn delete">🗑</button>
        </td>
      `;

      tr.querySelector(".select-checkbox").addEventListener("change", () => {
        todo.selected = !todo.selected;
        saveTodos();
      });

      tr.querySelector(".done-checkbox").addEventListener("change", () => {
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

  function updateProgress() {
    const done = todos.filter(t => t.completed).length;
    const total = todos.length;
    counter.textContent = `${done}/${total}`;
    progress.style.width = total ? (done / total) * 100 + "%" : "0%";
  }

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  noteForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!noteInput.value.trim()) return;

    notes.push({ text: noteInput.value.trim(), selected: false });
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
        <div>
          <input type="checkbox" class="note-select" ${n.selected ? "checked" : ""}>
          <p>${n.text}</p>
        </div>
        <div class="note-actions">
          <button class="edit">✏️</button>
          <button class="delete">🗑</button>
        </div>
      `;

      div.querySelector(".note-select").addEventListener("change", () => {
        n.selected = !n.selected;
        saveNotes();
      });

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

  if (deleteSelectedNotes) {
    deleteSelectedNotes.addEventListener("click", () => {
      const selectedIndices = notes.map((n, i) => n.selected ? i : -1).filter(i => i !== -1);
      if (!selectedIndices.length) return alert("No notes selected");
      if (!confirm("Delete selected notes?")) return;
      notes = notes.filter((_, i) => !selectedIndices.includes(i));
      saveNotes();
      renderNotes();
    });
  }

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  renderTodos();
  renderNotes();
});