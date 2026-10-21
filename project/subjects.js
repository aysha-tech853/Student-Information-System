let editingSubjectId = null;

function showAddForm() {
    document.getElementById('subjectForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Add New Subject';
    document.getElementById('addSubjectForm').reset();
    document.getElementById('subjectId').value = '';
    editingSubjectId = null;
    loadCourseOptions();
}

function cancelForm() {
    document.getElementById('subjectForm').style.display = 'none';
    document.getElementById('addSubjectForm').reset();
    editingSubjectId = null;
}

function loadCourseOptions() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const select = document.getElementById('courseId');

    select.innerHTML = '<option value="">Select Course</option>' +
        courses.map(course => `<option value="${course.id}">${course.courseName}</option>`).join('');
}

function handleSubjectSubmit(event) {
    event.preventDefault();

    const courseId = document.getElementById('courseId').value;
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.id === courseId);

    const subjectData = {
        id: editingSubjectId || Date.now().toString(),
        subjectCode: document.getElementById('subjectCode').value,
        subjectName: document.getElementById('subjectName').value,
        courseId: courseId,
        courseName: course ? course.courseName : '',
        semester: document.getElementById('semester').value,
        credits: document.getElementById('credits').value
    };

    let subjects = JSON.parse(localStorage.getItem('subjects') || '[]');

    if (editingSubjectId) {
        subjects = subjects.map(subject => subject.id === editingSubjectId ? subjectData : subject);
    } else {
        subjects.push(subjectData);
    }

    localStorage.setItem('subjects', JSON.stringify(subjects));
    cancelForm();
    loadSubjects();
    return false;
}

function loadSubjects() {
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const tbody = document.getElementById('subjectsTableBody');

    if (subjects.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No subjects available. Add a new subject to get started.</td></tr>';
        return;
    }

    tbody.innerHTML = subjects.map(subject => `
        <tr>
            <td>${subject.subjectCode}</td>
            <td>${subject.subjectName}</td>
            <td>${subject.courseName}</td>
            <td>Semester ${subject.semester}</td>
            <td>${subject.credits}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editSubject('${subject.id}')" class="btn btn-warning">Edit</button>
                    <button onclick="deleteSubject('${subject.id}')" class="btn btn-danger">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editSubject(id) {
    const subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
    const subject = subjects.find(s => s.id === id);

    if (subject) {
        loadCourseOptions();
        document.getElementById('subjectCode').value = subject.subjectCode;
        document.getElementById('subjectName').value = subject.subjectName;
        document.getElementById('courseId').value = subject.courseId;
        document.getElementById('semester').value = subject.semester;
        document.getElementById('credits').value = subject.credits;
        document.getElementById('formTitle').textContent = 'Edit Subject';
        document.getElementById('subjectForm').style.display = 'block';
        editingSubjectId = id;
    }
}

function deleteSubject(id) {
    if (confirm('Are you sure you want to delete this subject?')) {
        let subjects = JSON.parse(localStorage.getItem('subjects') || '[]');
        subjects = subjects.filter(s => s.id !== id);
        localStorage.setItem('subjects', JSON.stringify(subjects));
        loadSubjects();
    }
}

window.addEventListener('load', () => {
    loadSubjects();
    loadCourseOptions();
});
