let editingMarksId = null;

function showAddForm() {
    document.getElementById('marksForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Add Marks Entry';
    document.getElementById('addMarksForm').reset();
    document.getElementById('marksId').value = '';
    editingMarksId = null;
    loadStudentOptions();
}

function cancelForm() {
    document.getElementById('marksForm').style.display = 'none';
    document.getElementById('addMarksForm').reset();
    editingMarksId = null;
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

function handleMarksSubmit(event) {
    event.preventDefault();

    const studentId = document.getElementById('studentId').value;
    const subjectId = document.getElementById('subjectId').value;
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const student = students.find(s => s.id === studentId);
    const subject = subjects.find(s => s.id === subjectId);

    const marksData = {
        id: editingMarksId || Date.now().toString(),
        studentId: studentId,
        studentName: student ? student.fullName : '',
        rollNumber: student ? student.rollNumber : '',
        subjectId: subjectId,
        subjectName: subject ? subject.subjectName : '',
        examType: document.getElementById('examType').value,
        marksObtained: parseInt(document.getElementById('marksObtained').value),
        maxMarks: parseInt(document.getElementById('maxMarks').value),
        examDate: document.getElementById('examDate').value,
        remarks: document.getElementById('remarks').value
    };

    let marks = JSON.parse(localStorage.getItem('marks') || '[]');

    if (editingMarksId) {
        marks = marks.map(mark => mark.id === editingMarksId ? marksData : mark);
    } else {
        marks.push(marksData);
    }

    localStorage.setItem('marks', JSON.stringify(marks));
    cancelForm();
    loadMarks();
    return false;
}

function loadMarks() {
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    const tbody = document.getElementById('marksTableBody');

    if (marks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="no-data">No marks records available. Add a new entry to get started.</td></tr>';
        return;
    }

    tbody.innerHTML = marks.map(mark => {
        const percentage = ((mark.marksObtained / mark.maxMarks) * 100).toFixed(2);
        return `
            <tr>
                <td>${mark.studentName}</td>
                <td>${mark.rollNumber}</td>
                <td>${mark.subjectName}</td>
                <td>${mark.examType}</td>
                <td>${mark.marksObtained}</td>
                <td>${mark.maxMarks}</td>
                <td>${percentage}%</td>
                <td>${mark.examDate}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editMarks('${mark.id}')" class="btn btn-warning">Edit</button>
                        <button onclick="deleteMarks('${mark.id}')" class="btn btn-danger">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function editMarks(id) {
    const marks = JSON.parse(localStorage.getItem('marks') || '[]');
    const mark = marks.find(m => m.id === id);

    if (mark) {
        loadStudentOptions();
        document.getElementById('studentId').value = mark.studentId;
        loadStudentSubjects();
        document.getElementById('subjectId').value = mark.subjectId;
        document.getElementById('examType').value = mark.examType;
        document.getElementById('marksObtained').value = mark.marksObtained;
        document.getElementById('maxMarks').value = mark.maxMarks;
        document.getElementById('examDate').value = mark.examDate;
        document.getElementById('remarks').value = mark.remarks;
        document.getElementById('formTitle').textContent = 'Edit Marks Entry';
        document.getElementById('marksForm').style.display = 'block';
        editingMarksId = id;
    }
}

function deleteMarks(id) {
    if (confirm('Are you sure you want to delete this marks entry?')) {
        let marks = JSON.parse(localStorage.getItem('marks') || '[]');
        marks = marks.filter(m => m.id !== id);
        localStorage.setItem('marks', JSON.stringify(marks));
        loadMarks();
    }
}

window.addEventListener('load', () => {
    loadMarks();
    loadStudentOptions();
});
