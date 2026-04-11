
// Fetch all exams
async function getExams() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/exams`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch exams');

        return await response.json();

    } catch (error) {
        console.error('Error fetching exams:', error);
        return [];
    }
}


// Create new exam
async function createExam(name, date, description) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/exams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                subject: name,
                date: date,
                description: description || ''
            }),
        });

        if (!response.ok) throw new Error('Failed to create exam');

        return await response.json();

    } catch (error) {
        console.error('Error creating exam:', error);
        alert('Error creating exam');
    }
}

// Delete exam
async function deleteExam(id) {
    const confirmDelete = confirm('Delete this exam?');
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_BASE_URL}/exams/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete exam');

        await loadExams();

    } catch (error) {
        console.error(error);
        alert('Error deleting exam');
    }
}



// Calculate days remaining until exam
function calculateDaysLeft(examDate) {
    const today = new Date();
    const exam = new Date(examDate);

    today.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);

    const timeDiff = exam - today;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

// Get the next upcoming exam
async function getUpcomingExam() {
    const exams = await getExams();

    if (!exams.length) return null;

    const futureExams = exams.filter(exam =>
        calculateDaysLeft(exam.date) >= 0
    );

    if (!futureExams.length) return null;

    let closest = futureExams[0];
    let minDays = calculateDaysLeft(closest.date);

    futureExams.forEach(exam => {
        const days = calculateDaysLeft(exam.date);
        if (days < minDays) {
            minDays = days;
            closest = exam;
        }
    });

    return {
        name: closest.subject,
        date: closest.date,
        daysLeft: minDays
    };
}



// Initialize exam module
function initExamModule() {
    console.log("Exam module initialized");
}

// Export functions to global scope
window.getExams = getExams;
window.createExam = createExam;
window.deleteExam = deleteExam;
window.calculateDaysLeft = calculateDaysLeft;
window.getUpcomingExam = getUpcomingExam;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initExamModule);

console.log(window.location.hostname);