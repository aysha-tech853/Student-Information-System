function updateDashboardStats() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('totalSubjects').textContent = subjects.length;
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('totalRecords').textContent = marks.length + attendance.length;
}

window.addEventListener('load', updateDashboardStats);
