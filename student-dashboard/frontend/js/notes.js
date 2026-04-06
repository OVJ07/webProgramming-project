let notes = JSON.parse(localStorage.getItem("notes")) || [];

function displayNotes() {
  const container = document.getElementById("notesContainer");
  container.innerHTML = "";

  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";

    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button class="delete-btn" onclick="deleteNote(${index})">Delete</button>
    `;

    container.appendChild(noteDiv);
  });
}

function addNote() {
  const title = document.getElementById("titleInput").value;
  const content = document.getElementById("noteInput").value;

  if (title.trim() === "" && content.trim() === "") {
    return;
  }

  const newNote = {
    title: title,
    content: content,
  };

  notes.push(newNote);
  localStorage.setItem("notes", JSON.stringify(notes));

  clearFields();
  displayNotes();
}

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function clearFields() {
  document.getElementById("titleInput").value = "";
  document.getElementById("noteInput").value = "";
}

// Load notes on page start
displayNotes();