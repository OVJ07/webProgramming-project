// Exam Countdown Module
// This module handles all exam-related functionality

// Load exams from localStorage
function getExams() {
    const exams = localStorage.getItem('exams');
    return exams ? JSON.parse(exams) : [];
}

// Save exams to localStorage
function saveExams(exams) {
    localStorage.setItem('exams', JSON.stringify(exams));
}

// Add a new exam
function saveExam(exam) {
    const exams = getExams();
    exams.push(exam);
    saveExams(exams);
}

// Remove an exam by ID
function removeExam(id) {
    const exams = getExams();
    const updatedExams = exams.filter(exam => exam.id !== id);
    saveExams(updatedExams);
}

// Calculate days remaining between today and exam date
function calculateDaysLeft(examDate) {
    const today = new Date();
    const exam = new Date(examDate);
    
    // Set time to midnight for accurate day calculation
    today.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);
    
    const timeDiff = exam - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return daysDiff;
}

// Get the upcoming exam (nearest future exam)
function getUpcomingExam() {
    const exams = getExams();
    
    if (exams.length === 0) {
        return null;
    }
    
    // Filter future exams
    const futureExams = exams.filter(exam => {
        const daysLeft = calculateDaysLeft(exam.date);
        return daysLeft >= 0; // Include exams happening today
    });
    
    if (futureExams.length === 0) {
        return null;
    }
    
    // Find the exam with the smallest days left (closest future exam)
    let closestExam = futureExams[0];
    let minDays = calculateDaysLeft(closestExam.date);
    
    futureExams.forEach(exam => {
        const days = calculateDaysLeft(exam.date);
        if (days < minDays) {
            minDays = days;
            closestExam = exam;
        }
    });
    
    return {
        name: closestExam.name,
        date: closestExam.date,
        daysLeft: minDays
    };
}

// Initialize the exam module
function initExamModule() {
    // This function can be used to initialize any exam module functionality
    console.log("Exam module initialized");
}

// Export functions for use in other modules
window.getExams = getExams;
window.saveExam = saveExam;
window.removeExam = removeExam;
window.calculateDaysLeft = calculateDaysLeft;
window.getUpcomingExam = getUpcomingExam;
window.initExamModule = initExamModule;

// Initialize when the module loads
document.addEventListener('DOMContentLoaded', function() {
    initExamModule();
});
