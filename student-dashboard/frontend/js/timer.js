// Pomodoro Timer

const FOCUS_DURATION = 30;
const BREAK_DURATION = 10;

let timer = null;
let timeLeft = FOCUS_DURATION;
let isRunning = false;
let currentSession = 1;
let sessionType = 'Focus Time';
let studied = parseInt(localStorage.getItem('studiedSeconds'), 10) || 0;

let timerDisplay;
let startBtn;
let pauseBtn;
let resetBtn;
let sessionTypeEl;
let sessionCountEl;
let progressBar;
let totalTimeEl;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function syncStudiedTime() {
  localStorage.setItem('studiedSeconds', studied);
  if (totalTimeEl) {
    totalTimeEl.textContent = studied;
  }
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

function nextSession() {
  if (sessionType === 'Focus Time') {
    studied += FOCUS_DURATION;
    syncStudiedTime();
    sessionType = 'Break Time';
    timeLeft = BREAK_DURATION;
  } else {
    sessionType = 'Focus Time';
    timeLeft = FOCUS_DURATION;
    currentSession += 1;
  }

  updateSessionDisplay();
  updateControls();
}

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

  syncStudiedTime();
  updateControls();
  updateSessionDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
  timerDisplay = document.getElementById('timer');
  startBtn = document.getElementById('start-btn');
  pauseBtn = document.getElementById('pause-btn');
  resetBtn = document.getElementById('reset-btn');
  sessionTypeEl = document.getElementById('session-type');
  sessionCountEl = document.getElementById('session-count');
  progressBar = document.getElementById('progress-bar');
  totalTimeEl = document.getElementById('totalTime');

  if (!timerDisplay || !startBtn || !pauseBtn || !resetBtn) return;

  syncStudiedTime();
  updateControls();
  updateSessionDisplay();

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
});
