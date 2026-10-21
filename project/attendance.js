let editingAttendanceId = null;

function showAddForm() {
    document.getElementById('attendanceForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Add Attendance Record';
    document.getElementById('addAttendanceForm').reset();
    document.getElementById('attendanceId').value = '';
    editingAttendanceId = null;
    loadStudentOptions();
}

function cancelForm() {
    document.getElementById('attendanceForm').style.display = 'none';
    document.getElementById('addAttendanceForm').reset();
    editingAttendanceId = null;
}

function loadStudentOptions() {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const select = document.getElementById('studentId');

    select.innerHTML = '<option value="">Select Student</option>' +
        students.map(student => `<option value="${student.id}">${student.fullName} (${student.rollNumber})</option>`).join('');
}

function loadStudentSubjects() {
    const studentId = document.getElementById('studentId').value;
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => s.id === studentId);

    if (!student) {
        document.getElementById('subjectId').innerHTML = '<option value="">Select Subject</option>';
        return;
    }

    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const studentSubjects = subjects.filter(sub => sub.courseId === student.courseId);

    const select = document.getElementById('subjectId');
    select.innerHTML = '<option value="">Select Subject</option>' +
        studentSubjects.map(subject => `<option value="${subject.id}">${subject.subjectName}</option>`).join('');
}

function handleAttendanceSubmit(event) {
    event.preventDefault();

    const studentId = document.getElementById('studentId').value;
    const subjectId = document.getElementById('subjectId').value;
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const student = students.find(s => s.id === studentId);
    const subject = subjects.find(s => s.id === subjectId);

    const attendanceData = {
        id: editingAttendanceId || Date.now().toString(),
        studentId: studentId,
        studentName: student ? student.fullName : '',
        rollNumber: student ? student.rollNumber : '',
        subjectId: subjectId,
        subjectName: subject ? subject.subjectName : '',
        attendanceDate: document.getElementById('attendanceDate').value,
        status: document.getElementById('status').value,
        remarks: document.getElementById('remarks').value
    };

    let attendance = JSON.parse(localStorage.getItem('attendance') || '[]');

    if (editingAttendanceId) {
        attendance = attendance.map(att => att.id === editingAttendanceId ? attendanceData : att);
    } else {
        attendance.push(attendanceData);
    }

    localStorage.setItem('attendance', JSON.stringify(attendance));
    cancelForm();
    loadAttendance();
    return false;
}

function loadAttendance() {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const tbody = document.getElementById('attendanceTableBody');

    if (attendance.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No attendance records available. Add a new record to get started.</td></tr>';
        return;
    }

    tbody.innerHTML = attendance.map(att => {
        let statusClass = '';
        if (att.status === 'Present') statusClass = 'status-present';
        else if (att.status === 'Absent') statusClass = 'status-absent';
        else if (att.status === 'Late') statusClass = 'status-late';
        else if (att.status === 'Excused') statusClass = 'status-excused';

        return `
            <tr>
                <td>${att.studentName}</td>
                <td>${att.rollNumber}</td>
                <td>${att.subjectName}</td>
                <td>${att.attendanceDate}</td>
                <td class="${statusClass}">${att.status}</td>
                <td>${att.remarks || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editAttendance('${att.id}')" class="btn btn-warning">Edit</button>
                        <button onclick="deleteAttendance('${att.id}')" class="btn btn-danger">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function editAttendance(id) {
    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const att = attendance.find(a => a.id === id);

    if (att) {
        loadStudentOptions();
        document.getElementById('studentId').value = att.studentId;
        loadStudentSubjects();
        document.getElementById('subjectId').value = att.subjectId;
        document.getElementById('attendanceDate').value = att.attendanceDate;
        document.getElementById('status').value = att.status;
        document.getElementById('remarks').value = att.remarks;
        document.getElementById('formTitle').textContent = 'Edit Attendance Record';
        document.getElementById('attendanceForm').style.display = 'block';
        editingAttendanceId = id;
    }
}

function deleteAttendance(id) {
    if (confirm('Are you sure you want to delete this attendance record?')) {
        let attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
        attendance = attendance.filter(a => a.id !== id);
        localStorage.setItem('attendance', JSON.stringify(attendance));
        loadAttendance();
    }
}

window.addEventListener('load', () => {
    loadAttendance();
    loadStudentOptions();
});
