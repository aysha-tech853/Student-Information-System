let editingCourseId = null;

function showAddForm() {
    document.getElementById('courseForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Add New Course';
    document.getElementById('addCourseForm').reset();
    document.getElementById('courseId').value = '';
    editingCourseId = null;
}

function cancelForm() {
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById('addCourseForm').reset();
    editingCourseId = null;
}

function handleCourseSubmit(event) {
    event.preventDefault();

    const courseData = {
        id: editingCourseId || Date.now().toString(),
        courseCode: document.getElementById('courseCode').value.trim(),
        courseName: document.getElementById('courseName').value.trim(),
        duration: document.getElementById('duration').value,
        department: document.getElementById('department').value.trim()
    };

    if(!courseData.courseCode || !courseData.courseName || !courseData.duration || !courseData.department){
        alert('Please fill all the required fields');
        return false;
    }

    let courses = JSON.parse(localStorage.getItem('courses') || '[]');

      if (!editingCourseId) {
    const exists = courses.some(
      c => c.courseCode.toLowerCase() === courseData.courseCode.toLowerCase()
    );
    if (exists) {
      alert('Course code already exists. Please use a different code.');
      return false;
    }
  }

    if (editingCourseId) {
        courses = courses.map(course => course.id === editingCourseId ? courseData : course);
    } else {
        courses.push(courseData);
    }

    localStorage.setItem('courses', JSON.stringify(courses));
    cancelForm();
    loadCourses();
    return false;
}

function loadCourses() {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const tbody = document.getElementById('coursesTableBody');

    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data">No courses available. Add a new course to get started.</td></tr>';
        return;
    }

    tbody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.courseCode}</td>
            <td>${course.courseName}</td>
            <td>${course.duration} Year(s)</td>
            <td>${course.department}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="editCourse('${course.id}')" class="btn btn-warning">Edit</button>
                    <button onclick="deleteCourse('${course.id}')" class="btn btn-danger">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editCourse(id) {
    const courses = JSON.parse(localStorage.getItem('courses') || '[]');
    const course = courses.find(c => c.id === id);

    if (course) {
        document.getElementById('courseCode').value = course.courseCode;
        document.getElementById('courseName').value = course.courseName;
        document.getElementById('duration').value = course.duration;
        document.getElementById('department').value = course.department;
        document.getElementById('formTitle').textContent = 'Edit Course';
        document.getElementById('courseForm').style.display = 'block';
        editingCourseId = id;
    }
}

function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        let courses = JSON.parse(localStorage.getItem('courses') || '[]');
        courses = courses.filter(c => c.id !== id);
        localStorage.setItem('courses', JSON.stringify(courses));
        loadCourses();
    }
}

window.addEventListener('load', loadCourses);
