// Pomodoro Timer

// Timer configuration
const FOCUS_DURATION = 1500;
const BREAK_DURATION = 300; 

// Timer state variables
let timer = null;
let timeLeft = FOCUS_DURATION;
let isRunning = false;
let currentSession = 1;
let sessionType = 'Focus Time';
let studied = 0;

// DOM element references
let timerDisplay;
let startBtn;
let pauseBtn;
let resetBtn;
let sessionTypeEl;
let sessionCountEl;
let progressBar;
let totalTimeEl;

// Fetch studied time from backend
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

// Format seconds to MM:SS format
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update total time display
function updateTotalTime() {
  if (totalTimeEl) totalTimeEl.textContent = studied;
}

// Update button states
function updateControls() {
  if (!startBtn || !pauseBtn) return;
  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning;
}

// Update timer display
function updateTimer() {
  if (!timerDisplay || !progressBar) return;

  timerDisplay.textContent = formatTime(timeLeft);

  const totalTime = sessionType === 'Focus Time' ? FOCUS_DURATION : BREAK_DURATION;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  progressBar.style.width = `${Math.max(0, Math.min(progress, 100))}%`;
}

// Update session display
function updateSessionDisplay() {
  if (!sessionTypeEl || !sessionCountEl) return;

  sessionTypeEl.textContent = sessionType;
  sessionCountEl.textContent = `Session ${currentSession}`;

  updateTimer();
}

// Switch to next session
function nextSession() {
  if (sessionType === 'Focus Time') {
    studied += FOCUS_DURATION;

    saveStudiedTime();

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

// Start timer
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

// Pause timer
function pauseTimer() {
  if (!isRunning) return;

  clearInterval(timer);
  timer = null;
  isRunning = false;
  updateControls();
}

// Reset timer
function resetTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;

  timeLeft = FOCUS_DURATION;
  currentSession = 1;
  sessionType = 'Focus Time';
  studied = 0;

  saveStudiedTime();

  updateControls();
  updateSessionDisplay();
  updateTotalTime();
}

// Initialize timer on page load
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

  fetchStudiedTime();
  updateControls();
  updateSessionDisplay();

  startBtn?.addEventListener('click', startTimer);
  pauseBtn?.addEventListener('click', pauseTimer);
  resetBtn?.addEventListener('click', resetTimer);
});