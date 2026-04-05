// Pomodoro Timer (BACKEND VERSION)

// ============================================================
// REQUIREMENTS:
// - API_BASE_URL defined globally
// - Token stored: localStorage.setItem('token', data.token)
// - Backend route (you must create if not exists):
//   GET    /api/pomodoro
//   POST   /api/pomodoro   { studiedSeconds }
// ============================================================


// SETTINGS
const FOCUS_DURATION = 30; // seconds (change to 1800 for real use)
const BREAK_DURATION = 10;

let timer = null;
let timeLeft = FOCUS_DURATION;
let isRunning = false;
let currentSession = 1;
let sessionType = 'Focus Time';
let studied = 0;

// DOM elements
let timerDisplay;
let startBtn;
let pauseBtn;
let resetBtn;
let sessionTypeEl;
let sessionCountEl;
let progressBar;
let totalTimeEl;


// ============================
// 🔥 BACKEND FUNCTIONS
// ============================

// Get studied time from backend
async function fetchStudiedTime() {
  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`${API_BASE_URL}/pomodoro`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const data = await res.json();
    studied = data.studiedSeconds || 0;
    updateTotalTime();

  } catch (err) {
    console.error('Error fetching studied time:', err);
  }
}


// Save studied time to backend
async function saveStudiedTime() {
  try {
    const token = localStorage.getItem('token');

    await fetch(`${API_BASE_URL}/pomodoro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ studiedSeconds: studied }),
    });

  } catch (err) {
    console.error('Error saving studied time:', err);
  }
}


// ============================
// ⏱️ TIMER LOGIC (UNCHANGED)
// ============================

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


function updateTotalTime() {
  if (totalTimeEl) totalTimeEl.textContent = studied;
}


function updateControls() {
  if (!startBtn || !pauseBtn) return;
  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning;
}


function updateTimer() {
  if (!timerDisplay || !progressBar) return;

  timerDisplay.textContent = formatTime(timeLeft);

  const totalTime = sessionType === 'Focus Time' ? FOCUS_DURATION : BREAK_DURATION;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  progressBar.style.width = `${Math.max(0, Math.min(progress, 100))}%`;
}


function updateSessionDisplay() {
  if (!sessionTypeEl || !sessionCountEl) return;

  sessionTypeEl.textContent = sessionType;
  sessionCountEl.textContent = `Session ${currentSession}`;

  updateTimer();
}


// ============================
// 🔁 SESSION SWITCH
// ============================

function nextSession() {
  if (sessionType === 'Focus Time') {
    studied += FOCUS_DURATION;

    saveStudiedTime(); // 🔥 backend sync

    sessionType = 'Break Time';
    timeLeft = BREAK_DURATION;

  } else {
    sessionType = 'Focus Time';
    timeLeft = FOCUS_DURATION;
    currentSession++;
  }

  updateTotalTime();
  updateSessionDisplay();
  updateControls();
}


// ============================
// ▶️ CONTROLS
// ============================

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  updateControls();

  timer = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 1);
    updateTimer();

    if (timeLeft === 0) {
      clearInterval(timer);
      timer = null;
      isRunning = false;
      updateControls();

      alert(`${sessionType} completed!`);
      nextSession();
    }
  }, 1000);
}


function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timer);
  timer = null;
  isRunning = false;
  updateControls();
}


function resetTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;

  timeLeft = FOCUS_DURATION;
  currentSession = 1;
  sessionType = 'Focus Time';
  studied = 0;

  saveStudiedTime(); // 🔥 backend reset

  updateControls();
  updateSessionDisplay();
  updateTotalTime();
}


// ============================
// 🚀 INIT
// ============================

document.addEventListener('DOMContentLoaded', () => {
  timerDisplay = document.getElementById('timer');
  startBtn = document.getElementById('start-btn');
  pauseBtn = document.getElementById('pause-btn');
  resetBtn = document.getElementById('reset-btn');
  sessionTypeEl = document.getElementById('session-type');
  sessionCountEl = document.getElementById('session-count');
  progressBar = document.getElementById('progress-bar');
  totalTimeEl = document.getElementById('totalTime');

  if (!timerDisplay) return;

  fetchStudiedTime(); // 🔥 load from backend
  updateControls();
  updateSessionDisplay();

  startBtn?.addEventListener('click', startTimer);
  pauseBtn?.addEventListener('click', pauseTimer);
  resetBtn?.addEventListener('click', resetTimer);
});