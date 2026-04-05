// Task management functions


// Get tasks from API
async function getTasks() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    displayTasks(tasks);
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    document.getElementById('task-list').innerHTML = '<p>Error loading tasks</p>';
  }
}

// Create new task
async function createTask(title, description, dueDate) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, dueDate }),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const task = await response.json();
    getTasks(); // Refresh task list
    return task;
  } catch (error) {
    console.error('Error creating task:', error);
    alert('Error creating task');
  }
}

// Update task
async function updateTask(id, updates) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const task = await response.json();
    getTasks(); // Refresh task list
    return task;
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Error updating task');
  }
}

// Delete task
async function deleteTask(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    getTasks(); // Refresh task list
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Error deleting task');
  }
}

// Display tasks in the UI
function displayTasks(tasks) {
  const taskList = document.getElementById('task-list');
  
  if (tasks.length === 0) {
    taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
    return;
  }

  taskList.innerHTML = tasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task._id}">
      <span class="task-title">${task.title}</span>
      ${task.dueDate ? `<span class="task-due">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
      <div class="task-actions">
        <button class="btn btn-complete" onclick="toggleTask('${task._id}', ${task.completed})">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button class="btn btn-delete" onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

// Toggle task completion
async function toggleTask(id, completed) {
  try {
    await updateTask(id, { completed: !completed });
  } catch (error) {
    console.error('Error toggling task:', error);
  }
}

// Initialize task page
document.addEventListener('DOMContentLoaded', () => {
  // Only run on task page
  if (window.location.pathname.includes('task.html')) {
    getTasks();
    
    // Handle form submission
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => {
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-due-date').value;
        
        if (!title) {
          alert('Please enter a task title');
          return;
        }
        
        createTask(title, description, dueDate);
        document.getElementById('task-title').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-due-date').value = '';
      });
    }
  }
});
