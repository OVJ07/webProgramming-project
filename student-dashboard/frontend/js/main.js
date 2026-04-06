// Main dashboard functions

// Load dashboard data
async function loadDashboard() {
  try {
    const token = localStorage.getItem('token');

    // ====================
    // 👤 USER INFO
    // ====================
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      document.getElementById('user-name').textContent = user.name;
      document.getElementById('user-email').textContent = user.email;
    }

    // ====================
    // 📋 TASKS
    // ====================
    const tasksResponse = await fetch(`${API_BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tasks = await tasksResponse.json();
    document.getElementById('tasks-count').textContent = tasks.length;

    // ====================
    // 📝 NOTES
    // ====================
    const notesResponse = await fetch(`${API_BASE_URL}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const notes = await notesResponse.json();
    document.getElementById('notes-count').textContent = notes.length;

    // ====================
    // 📅 EXAMS
    // ====================
    const examsResponse = await fetch(`${API_BASE_URL}/exams/upcoming`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const exams = await examsResponse.json();
    document.getElementById('exams-count').textContent = exams.length;

   // 🎯 All upcoming exams (sorted)
const examContainer = document.getElementById('next-exam');

if (exams.length === 0) {
  examContainer.innerHTML = `<p>No upcoming exams</p>`;
} else {
  examContainer.innerHTML = exams.map(exam => {
    const daysLeft = daysUntil(exam.date);

    return `
      <div class="exam-item ${daysLeft <= 3 ? 'urgent' : ''}">
        <h3>${exam.subject}</h3>
        <p>Date: ${new Date(exam.date).toLocaleDateString()}</p>
        <p>${daysLeft > 0 ? `${daysLeft} days left` : 'Exam today!'}</p>
      </div>
    `;
  }).join('');
}

    // ====================
    // 📌 RECENT TASKS
    // ====================
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

    // ====================
    // 📊 ATTENDANCE
    // ====================
    const attendanceResponse = await fetch(`${API_BASE_URL}/attendance`, {
      headers: { Authorization: `Bearer ${token}` },
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

      const percentage = totalTotal > 0
        ? Math.round((totalPresent / totalTotal) * 100)
        : 0;

      // 🔥 Update stat card
      document.getElementById('attendance-percentage').textContent = percentage + '%';

      attendanceContainer.innerHTML = `
        <div class="attendance-item">
          <span>Overall Attendance</span>
          <span>${percentage}%</span>
        </div>
        <div class="attendance-item">
          <span>Total Classes</span>
          <span>${totalTotal}</span>
        </div>
        <div class="attendance-item">
          <span>Present</span>
          <span>${totalPresent}</span>
        </div>
      `;
    }

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}


// ============================
// 📅 Days until exam
// ============================
function daysUntil(date) {
  const today = new Date();
  const examDate = new Date(date);
  return Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
}


// ============================
// 🚀 INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    loadDashboard();
  }
});