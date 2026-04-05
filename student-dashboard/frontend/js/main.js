// Main dashboard functions


// Load dashboard data
async function loadDashboard() {
  try {
    // Get user info
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      document.getElementById('user-name').textContent = user.name;
      document.getElementById('user-email').textContent = user.email;
    }
    
    // Get tasks count
    const token = localStorage.getItem('token');
    const tasksResponse = await fetch(`${API_BASE_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const tasks = await tasksResponse.json();
    document.getElementById('tasks-count').textContent = tasks.length;
    
    // Get notes count
    const notesResponse = await fetch(`${API_BASE_URL}/notes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const notes = await notesResponse.json();
    document.getElementById('notes-count').textContent = notes.length;
    
    // Get exams
    const examsResponse = await fetch(`${API_BASE_URL}/exams/upcoming`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const exams = await examsResponse.json();
    document.getElementById('exams-count').textContent = exams.length;
    
    // Get next exam
    if (exams.length > 0) {
      const nextExam = exams[0];
      const daysLeft = daysUntil(nextExam.date);
      const dateStr = new Date(nextExam.date).toLocaleDateString();
      
      document.getElementById('next-exam').innerHTML = `
        <h3>${nextExam.subject}</h3>
        <p>Date: ${dateStr}</p>
        <p>${daysLeft > 0 ? `${daysLeft} days left` : 'Exam today!'}</p>
      `;
    }
    
    // Get recent tasks
    const recentTasks = tasks.slice(0, 3);
    const tasksContainer = document.getElementById('recent-tasks');
    
    if (recentTasks.length === 0) {
      tasksContainer.innerHTML = '<p>No tasks found</p>';
    } else {
      tasksContainer.innerHTML = recentTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
          <span class="task-title">${task.title}</span>
          ${task.dueDate ? `<span class="task-due">Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
        </div>
      `).join('');
    }
    
    // Get attendance summary
    const attendanceResponse = await fetch(`${API_BASE_URL}/attendance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const attendance = await attendanceResponse.json();
    const attendanceContainer = document.getElementById('attendance-summary');
    
    if (attendance.length === 0) {
      attendanceContainer.innerHTML = '<p>No attendance records</p>';
    } else {
      let totalPresent = 0;
      let totalTotal = 0;
      
      attendance.forEach(record => {
        totalPresent += record.present;
        totalTotal += record.total;
      });
      
      const percentage = totalTotal > 0 ? Math.round((totalPresent / totalTotal) * 100) : 0;
      
      attendanceContainer.innerHTML = `
        <div class="attendance-item">
          <span class="subject">Overall Attendance</span>
          <span class="percentage">${percentage}%</span>
        </div>
        <div class="attendance-item">
          <span class="subject">Total Classes</span>
          <span class="percentage">${totalTotal}</span>
        </div>
        <div class="attendance-item">
          <span class="subject">Present</span>
          <span class="percentage">${totalPresent}</span>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Calculate days until exam
function daysUntil(date) {
  const today = new Date();
  const examDate = new Date(date);
  const diffTime = examDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Only run on dashboard page
  if (window.location.pathname.includes('index.html')) {
    loadDashboard();
  }
});
