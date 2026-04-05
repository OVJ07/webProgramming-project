// Notes management functions


// Get notes from API
async function getNotes() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }

    const notes = await response.json();
    displayNotes(notes);
    return notes;
  } catch (error) {
    console.error('Error fetching notes:', error);
    document.getElementById('notes-list').innerHTML = '<p>Error loading notes</p>';
  }
}

// Create new note
async function createNote(title, content) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      throw new Error('Failed to create note');
    }

    const note = await response.json();
    getNotes(); // Refresh note list
    return note;
  } catch (error) {
    console.error('Error creating note:', error);
    alert('Error creating note');
  }
}

// Delete note
async function deleteNote(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    getNotes(); // Refresh note list
    return true;
  } catch (error) {
    console.error('Error deleting note:', error);
    alert('Error deleting note');
  }
}

// Display notes in the UI
function displayNotes(notes) {
  const notesList = document.getElementById('notes-list');
  
  if (notes.length === 0) {
    notesList.innerHTML = '<p class="no-notes">No notes found</p>';
    return;
  }

  notesList.innerHTML = notes.map(note => `
    <div class="note-item" data-id="${note._id}">
      <div class="note-title">${note.title}</div>
      <div class="note-content">${note.content}</div>
      <div class="note-actions">
        <button class="btn btn-delete" onclick="deleteNote('${note._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Initialize notes page
document.addEventListener('DOMContentLoaded', () => {
  // Only run on notes page
  if (window.location.pathname.includes('notes.html')) {
    getNotes();
    
    // Handle form submission
    const addNoteBtn = document.getElementById('add-note-btn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', () => {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        
        if (!title) {
          alert('Please enter a note title');
          return;
        }
        
        createNote(title, content);
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
      });
    }
  }
});
