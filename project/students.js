let editingStudentId = null;

function showAddForm() {
    document.getElementById('studentForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Add New Student';
    document.getElementById('addStudentForm').reset();
    document.getElementById('studentId').value = '';
    editingStudentId = null;
    loadCourseOptions();
}

function cancelForm() {
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('addStudentForm').reset();
    editingStudentId = null;
}

function loadCourseOptions() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const select = document.getElementById('courseId');

    select.innerHTML = '<option value="">Select Course</option>' +
        courses.map(course => `<option value="${course.id}">${course.courseName}</option>`).join('');
}

function handleStudentSubmit(event) {
    event.preventDefault();

    const courseId = document.getElementById('courseId').value;
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.id === courseId);

    const studentData = {
        id: editingStudentId || Date.now().toString(),
        rollNumber: document.getElementById('rollNumber').value,
        registrationNumber: document.getElementById('registrationNumber').value,
        fullName: document.getElementById('fullName').value,
        gender: document.getElementById('gender').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        courseId: courseId,
        courseName: course ? course.courseName : '',
        currentSemester: document.getElementById('currentSemester').value,
        admissionDate: document.getElementById('admissionDate').value
    };

    let students = JSON.parse(localStorage.getItem('students') || '[]');

    if (editingStudentId) {
        editingStudentId = localStorage.getItem('editingStudentId');
    } else {
        // ---- DATABASE INTEGRATION STRAT ----

    fetch('http://localhost/project/project/insert.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'name': studentData.fullName,
            'rollNo': studentData.rollNumber,
            'regNo': studentData.registrationNumber,
            'course': studentData.courseName,
            'semester': studentData.currentSemester,
            'email': studentData.email,
            'phone': studentData.phone
        })
    })
      .then(response => response.text())
      .then(data => {
        console.log("Database Response:", data);
      })  
      .catch(error => {
          console.error('Error:', error);
      });
    }

     localStorage.setItem('students', JSON.stringify(students));
    cancelForm();
    loadStudents();
    return false;
}

function loadStudents() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const tbody = document.getElementById('studentsTableBody');

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="no-data">No students available. Add a new student to get started.</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.rollNumber}</td>
            <td>${student.registrationNumber}</td>
            <td>${student.fullName}</td>
            <td>${student.courseName}</td>
            <td>Semester ${student.currentSemester}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editStudent('${student.id}')" class="btn btn-warning">Edit</button>
                    <button onclick="deleteStudent('${student.id}')" class="btn btn-danger">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editStudent(id) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === id);

    if (student) {
        loadCourseOptions();
        document.getElementById('rollNumber').value = student.rollNumber;
        document.getElementById('registrationNumber').value = student.registrationNumber;
        document.getElementById('fullName').value = student.fullName;
        document.getElementById('gender').value = student.gender;
        document.getElementById('dateOfBirth').value = student.dateOfBirth;
        document.getElementById('email').value = student.email;
        document.getElementById('phone').value = student.phone;
        document.getElementById('address').value = student.address;
        document.getElementById('courseId').value = student.courseId;
        document.getElementById('currentSemester').value = student.currentSemester;
        document.getElementById('admissionDate').value = student.admissionDate;
        document.getElementById('formTitle').textContent = 'Edit Student';
        document.getElementById('studentForm').style.display = 'block';
        editingStudentId = id;
    }
}

function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        let students = JSON.parse(localStorage.getItem('students') || '[]');
        students = students.filter(s => s.id !== id);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
    }
}

window.addEventListener('load', () => {
    loadStudents();
    loadCourseOptions();
});
