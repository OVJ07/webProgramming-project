// Attendance management functions

// Fetch attendance records
async function getAttendance() {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/attendance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch attendance');

    const attendance = await response.json();

    displayAttendance(attendance);
    updateOverallBar(attendance);

    return attendance;

  } catch (error) {
    console.error('Error fetching attendance:', error);
    document.getElementById('attendance-list').innerHTML =
      '<p>Error loading attendance records</p>';
  }
}

// Create attendance record
async function createAttendance(subject, present, total) {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ subject, present, total }),
    });

    if (!response.ok) throw new Error('Failed to create attendance');

    const record = await response.json();
    getAttendance();
    return record;

  } catch (error) {
    console.error('Error creating attendance:', error);
    alert('Error creating attendance record');
  }
}

// Update attendance record
async function updateAttendance(id, updates) {
  try {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) throw new Error('Failed to update attendance');

    const record = await response.json();
    getAttendance();
    return record;

  } catch (error) {
    console.error('Error updating attendance:', error);
    alert('Error updating attendance record');
  }
}

// Delete attendance record
async function deleteAttendance(id) {
  try {
    if (!confirm('Are you sure you want to delete this record?')) return;

    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to delete attendance');

    getAttendance();
    return true;

  } catch (error) {
    console.error('Error deleting attendance:', error);
    alert('Error deleting attendance record');
  }
}

// Mark attendance as present
async function markPresent(id, currentPresent, currentTotal) {
  await updateAttendance(id, {
    present: currentPresent + 1,
    total: currentTotal + 1
  });
}

// Mark attendance as absent
async function markAbsent(id, currentPresent, currentTotal) {
  await updateAttendance(id, {
    present: currentPresent,
    total: currentTotal + 1
  });
}

// Calculate attendance percentage
function calculatePercentage(present, total) {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

// Calculate classes needed to reach 75%
function classesNeeded(present, total) {
  let n = 0, p = present, t = total;

  while (calculatePercentage(p, t) < 75 && n < 500) {
    p++; t++; n++;
  }

  return n;
}

// Display attendance records in UI
function displayAttendance(attendance) {
  const attendanceList = document.getElementById('attendance-list');

  if (attendance.length === 0) {
    attendanceList.innerHTML =
      '<p class="no-attendance">No attendance records found</p>';
    return;
  }

  attendanceList.innerHTML = attendance.map(record => {
    const percentage = calculatePercentage(record.present, record.total);
    const missed = record.total - record.present;
    const pctClass = percentage >= 75 ? 'good' : 'low';
    const barColor = percentage >= 75 ? '#27ae60' : '#e74c3c';

    const warningHTML = percentage < 75
      ? `<div class="attendance-warning">
          ⚠ Below 75% — Attend <b>${classesNeeded(record.present, record.total)}</b> more class(es)
        </div>`
      : '';

    return `
      <div class="attendance-item" data-id="${record._id}">
        <div class="attendance-item-top">
          <span class="attendance-subject">${record.subject}</span>
          <span class="attendance-percentage ${pctClass}">
            ${percentage}%
          </span>
        </div>

        <div class="attendance-progress-bg">
          <div class="attendance-progress-fill"
               style="width:${percentage}%; background-color:${barColor};">
          </div>
        </div>

        <div class="attendance-item-bottom">
          <div class="attendance-stats">
            <span>Present: ${record.present}</span>
            <span>Total: ${record.total}</span>
            <span>Missed: ${missed}</span>
          </div>

          <div class="attendance-actions">
            <button onclick="markPresent('${record._id}', ${record.present}, ${record.total})">
              Present
            </button>
            <button onclick="markAbsent('${record._id}', ${record.present}, ${record.total})">
              Absent
            </button>
            <button onclick="editAttendance('${record._id}', ${record.present}, ${record.total})">
              Edit
            </button>
            <button onclick="deleteAttendance('${record._id}')">
              Delete
            </button>
          </div>
        </div>

        ${warningHTML}
      </div>
    `;
  }).join('');
}

// Edit attendance record
function editAttendance(id, present, total) {
  const newPresent = prompt('Enter new present count:', present);
  const newTotal = prompt('Enter new total count:', total);

  if (newPresent !== null && newTotal !== null) {
    updateAttendance(id, {
      present: parseInt(newPresent),
      total: parseInt(newTotal)
    });
  }
}

// Update overall attendance bar
function updateOverallBar(records) {
  const overallBar = document.getElementById('overall-bar');
  if (!overallBar) return;

  if (records.length === 0) {
    overallBar.style.display = 'none';
    return;
  }

  const totalPresent = records.reduce((sum, r) => sum + r.present, 0);
  const totalClasses = records.reduce((sum, r) => sum + r.total, 0);

  const percentage = calculatePercentage(totalPresent, totalClasses);
  const color = percentage >= 75 ? '#27ae60' : '#e74c3c';

  overallBar.style.display = 'flex';
  overallBar.style.borderColor = color;

  document.getElementById('overall-pct').innerHTML =
    `<span style="color:${color}">${percentage}%</span>`;

  document.getElementById('overall-detail').innerHTML =
    `(${totalPresent} attended out of ${totalClasses})`;
}

// Initialize attendance page on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-attendance-btn');

  getAttendance();

  addBtn?.addEventListener('click', () => {
    const subject = document.getElementById('subject-name').value;
    const present = parseInt(document.getElementById('present-count').value);
    const total = parseInt(document.getElementById('total-count').value);

    if (!subject) return alert('Enter subject');
    if (isNaN(present) || isNaN(total)) return alert('Invalid numbers');
    if (present > total) return alert('Present > Total not allowed');

    createAttendance(subject, present, total);

    document.getElementById('subject-name').value = '';
    document.getElementById('present-count').value = '0';
    document.getElementById('total-count').value = '0';
  });
});