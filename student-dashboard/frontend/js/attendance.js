// Attendance management functions

// ============================================================
//  NOTE FOR BACKEND DEVELOPER:
//  - API_BASE_URL is defined in main.js (already in project)
//  - In each function below, UNCOMMENT the fetch() block
//    and DELETE the localStorage block below it
//  - Make sure auth.js saves token as:
//    localStorage.setItem('token', data.token)
//  Routes expected (already in attendanceRoutes.js):
//    GET    /api/attendance
//    POST   /api/attendance        body: { subject, present, total }
//    PUT    /api/attendance/:id    body: { present, total }
//    DELETE /api/attendance/:id
// ============================================================


// Get attendance records
async function getAttendance() {
  try {

    // ---- BACKEND (uncomment when backend is ready) ----------
    // const token = localStorage.getItem('token');
    // const response = await fetch(`${API_BASE_URL}/attendance`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });
    // if (!response.ok) throw new Error('Failed to fetch attendance records');
    // const attendance = await response.json();
    // ---------------------------------------------------------

    // ---- localStorage (remove when backend is connected) ----
    const attendance = loadFromStorage();
    // ---------------------------------------------------------

    displayAttendance(attendance);
    updateOverallBar(attendance);
    return attendance;

  } catch (error) {
    console.error('Error fetching attendance:', error);
    document.getElementById('attendance-list').innerHTML = '<p>Error loading attendance records</p>';
  }
}


// Create new attendance record
async function createAttendance(subject, present, total) {
  try {

    // ---- BACKEND (uncomment when backend is ready) ----------
    // const token = localStorage.getItem('token');
    // const response = await fetch(`${API_BASE_URL}/attendance`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ subject, present, total }),
    // });
    // if (!response.ok) throw new Error('Failed to create attendance record');
    // const record = await response.json();
    // getAttendance();
    // return record;
    // ---------------------------------------------------------

    // ---- localStorage (remove when backend is connected) ----
    const records = loadFromStorage();
    const newRecord = {
      _id:     Date.now().toString(),
      subject: subject,
      present: present,
      total:   total
    };
    records.push(newRecord);
    saveToStorage(records);
    getAttendance();
    return newRecord;
    // ---------------------------------------------------------

  } catch (error) {
    console.error('Error creating attendance record:', error);
    alert('Error creating attendance record');
  }
}


// Update attendance record
async function updateAttendance(id, updates) {
  try {

    // ---- BACKEND (uncomment when backend is ready) ----------
    // const token = localStorage.getItem('token');
    // const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(updates),
    // });
    // if (!response.ok) throw new Error('Failed to update attendance record');
    // const record = await response.json();
    // getAttendance();
    // return record;
    // ---------------------------------------------------------

    // ---- localStorage (remove when backend is connected) ----
    const records = loadFromStorage();
    for (let i = 0; i < records.length; i++) {
      if (records[i]._id === id) {
        records[i].present = updates.present;
        records[i].total   = updates.total;
        break;
      }
    }
    saveToStorage(records);
    getAttendance();
    // ---------------------------------------------------------

  } catch (error) {
    console.error('Error updating attendance record:', error);
    alert('Error updating attendance record');
  }
}


// Delete attendance record
async function deleteAttendance(id) {
  try {
    if (!confirm('Are you sure you want to delete this record?')) return;

    // ---- BACKEND (uncomment when backend is ready) ----------
    // const token = localStorage.getItem('token');
    // const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });
    // if (!response.ok) throw new Error('Failed to delete attendance record');
    // getAttendance();
    // return true;
    // ---------------------------------------------------------

    // ---- localStorage (remove when backend is connected) ----
    const records = loadFromStorage().filter(r => r._id !== id);
    saveToStorage(records);
    getAttendance();
    // ---------------------------------------------------------

  } catch (error) {
    console.error('Error deleting attendance record:', error);
    alert('Error deleting attendance record');
  }
}


// Mark present
async function markPresent(id, currentPresent, currentTotal) {
  await updateAttendance(id, {
    present: currentPresent + 1,
    total:   currentTotal   + 1
  });
}


// Mark absent
async function markAbsent(id, currentPresent, currentTotal) {
  await updateAttendance(id, {
    present: currentPresent,
    total:   currentTotal + 1
  });
}


// Calculate percentage
function calculatePercentage(present, total) {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}


// Calculate how many consecutive classes needed to reach 75%
function classesNeeded(present, total) {
  let n = 0, p = present, t = total;
  while (calculatePercentage(p, t) < 75 && n < 500) {
    p++; t++; n++;
  }
  return n;
}


// Display attendance records in the UI
function displayAttendance(attendance) {
  const attendanceList = document.getElementById('attendance-list');

  if (attendance.length === 0) {
    attendanceList.innerHTML = '<p class="no-attendance">No attendance records found</p>';
    return;
  }

  attendanceList.innerHTML = attendance.map(record => {
    const percentage = calculatePercentage(record.present, record.total);
    const missed     = record.total - record.present;
    const pctClass   = percentage >= 75 ? 'good' : 'low';
    const barColor   = percentage >= 75 ? '#27ae60' : '#e74c3c';

    const warningHTML = percentage < 75
      ? `<div class="attendance-warning">&#9888; Below 75% &mdash; Attend <b>${classesNeeded(record.present, record.total)}</b> more class(es) to recover.</div>`
      : '';

    return `
      <div class="attendance-item" data-id="${record._id}">
        <div class="attendance-item-top">
          <span class="attendance-subject">${record.subject}</span>
          <span class="attendance-percentage ${pctClass}">${percentage}%</span>
        </div>
        <div class="attendance-progress-bg">
          <div class="attendance-progress-fill" style="width:${percentage}%; background-color:${barColor};"></div>
        </div>
        <div class="attendance-item-bottom">
          <div class="attendance-stats">
            <span>Present: ${record.present}</span>
            <span>Total: ${record.total}</span>
            <span>Missed: ${missed}</span>
          </div>
          <div class="attendance-actions">
            <button class="btn btn-present" onclick="markPresent('${record._id}', ${record.present}, ${record.total})">Present</button>
            <button class="btn btn-absent"  onclick="markAbsent('${record._id}',  ${record.present}, ${record.total})">Absent</button>
            <button class="btn btn-edit"    onclick="editAttendance('${record._id}', ${record.present}, ${record.total})">Edit</button>
            <button class="btn btn-delete"  onclick="deleteAttendance('${record._id}')">Delete</button>
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
  const newTotal   = prompt('Enter new total count:', total);

  if (newPresent !== null && newTotal !== null) {
    updateAttendance(id, { present: parseInt(newPresent), total: parseInt(newTotal) });
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

  const grandPresent = records.reduce((sum, r) => sum + r.present, 0);
  const grandTotal   = records.reduce((sum, r) => sum + r.total,   0);
  const overallPct   = calculatePercentage(grandPresent, grandTotal);
  const color        = overallPct >= 75 ? '#27ae60' : '#e74c3c';

  overallBar.style.display     = 'flex';
  overallBar.style.borderColor = color;

  document.getElementById('overall-pct').innerHTML    = `<span style="color:${color}">${overallPct}%</span>`;
  document.getElementById('overall-detail').innerHTML = `(${grandPresent} attended out of ${grandTotal})`;
}


// ============================================================
//  localStorage HELPERS
//  (only used until backend is connected — delete after)
// ============================================================

function loadFromStorage() {
  const data = localStorage.getItem('attendance_records');
  return data ? JSON.parse(data) : [];
}

function saveToStorage(records) {
  localStorage.setItem('attendance_records', JSON.stringify(records));
}


// Initialize attendance page
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('attendance.html')) {
    getAttendance();

    const addAttendanceBtn = document.getElementById('add-attendance-btn');
    if (addAttendanceBtn) {
      addAttendanceBtn.addEventListener('click', () => {
        const subject = document.getElementById('subject-name').value;
        const present = parseInt(document.getElementById('present-count').value);
        const total   = parseInt(document.getElementById('total-count').value);

        if (!subject) {
          alert('Please enter a subject name');
          return;
        }
        if (isNaN(present) || isNaN(total)) {
          alert('Please enter valid numbers for present and total');
          return;
        }
        if (present > total) {
          alert('Present count cannot be more than total classes');
          return;
        }

        createAttendance(subject, present, total);
        document.getElementById('subject-name').value   = '';
        document.getElementById('present-count').value  = '0';
        document.getElementById('total-count').value    = '0';
      });
    }
  }
});
