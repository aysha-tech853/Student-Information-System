function loadReportOptions() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');

    const courseSelect = document.getElementById('reportCourseId');
    courseSelect.innerHTML = '<option value="">Select Course</option>' +
        courses.map(course => `<option value="${course.id}">${course.courseName}</option>`).join('');

    const studentSelect = document.getElementById('reportStudentId');
    studentSelect.innerHTML = '<option value="">Select Student</option>' +
        students.map(student => `<option value="${student.id}">${student.fullName} (${student.rollNumber})</option>`).join('');
}

function generateCourseReport(event) {
    event.preventDefault();

    const courseId = document.getElementById('reportCourseId').value;
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const course = courses.find(c => c.id === courseId);

    if (!course) return false;

    const courseStudents = students.filter(s => s.courseId === courseId);

    const reportTitle = document.getElementById('reportTitle');
    const reportContent = document.getElementById('reportContent');
    const reportResult = document.getElementById('reportResult');

    reportTitle.textContent = `Course-wise Student List: ${course.courseName}`;

    if (courseStudents.length === 0) {
        reportContent.innerHTML = '<p class="no-data">No students enrolled in this course.</p>';
    } else {
        reportContent.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Roll Number</th>
                        <th>Registration Number</th>
                        <th>Full Name</th>
                        <th>Gender</th>
                        <th>Current Semester</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Admission Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${courseStudents.map(student => `
                        <tr>
                            <td>${student.rollNumber}</td>
                            <td>${student.registrationNumber}</td>
                            <td>${student.fullName}</td>
                            <td>${student.gender}</td>
                            <td>Semester ${student.currentSemester}</td>
                            <td>${student.email}</td>
                            <td>${student.phone}</td>
                            <td>${student.admissionDate}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    reportResult.style.display = 'block';
    return false;
}

function generateMarksReport(event) {
    event.preventDefault();

    const studentId = document.getElementById('reportStudentId').value;
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    const student = students.find(s => s.id === studentId);

    if (!student) return false;

    const studentMarks = marks.filter(m => m.studentId === studentId);

    const reportTitle = document.getElementById('reportTitle');
    const reportContent = document.getElementById('reportContent');
    const reportResult = document.getElementById('reportResult');

    reportTitle.textContent = `Student Marks Report: ${student.fullName} (${student.rollNumber})`;

    let totalMarks = 0;
    let totalMax = 0;

    const reportHTML = `
        <div style="margin-bottom: 20px;">
            <p><strong>Course:</strong> ${student.courseName}</p>
            <p><strong>Current Semester:</strong> Semester ${student.currentSemester}</p>
            <p><strong>Email:</strong> ${student.email}</p>
        </div>
    `;

    if (studentMarks.length === 0) {
        reportContent.innerHTML = reportHTML + '<p class="no-data">No marks records available for this student.</p>';
    } else {
        studentMarks.forEach(mark => {
            totalMarks += mark.marksObtained;
            totalMax += mark.maxMarks;
        });

        const overallPercentage = ((totalMarks / totalMax) * 100).toFixed(2);

        reportContent.innerHTML = reportHTML + `
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Exam Type</th>
                        <th>Marks Obtained</th>
                        <th>Maximum Marks</th>
                        <th>Percentage</th>
                        <th>Exam Date</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    ${studentMarks.map(mark => {
                        const percentage = ((mark.marksObtained / mark.maxMarks) * 100).toFixed(2);
                        return `
                            <tr>
                                <td>${mark.subjectName}</td>
                                <td>${mark.examType}</td>
                                <td>${mark.marksObtained}</td>
                                <td>${mark.maxMarks}</td>
                                <td>${percentage}%</td>
                                <td>${mark.examDate}</td>
                                <td>${mark.remarks || '-'}</td>
                            </tr>
                        `;
                    }).join('')}
                    <tr style="background-color: #e8f0f7; font-weight: 600;">
                        <td colspan="2">Overall Performance</td>
                        <td>${totalMarks}</td>
                        <td>${totalMax}</td>
                        <td>${overallPercentage}%</td>
                        <td colspan="2"></td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    reportResult.style.display = 'block';
    return false;
}

function printReport() {
    window.print();
}

window.addEventListener('load', loadReportOptions);
