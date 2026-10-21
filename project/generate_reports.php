<?php
$conn = mysqli_connect("localhost", "root", "", "student_db");
if (!$conn) { die("Connection failed: " . mysqli_connect_error()); }

echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>Generated Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f4f4f4; }
        .report-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px #ccc; max-width: 900px; margin: auto; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #007bff; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .btn-print { background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; float: right; margin-bottom: 20px; }
    </style>
    <head>
    <body>
     <div class='report-box'>
<button onclick='window.print()' class='btn-print'>Print Report</button>";

// 1. Course-wise Student List
if (isset($_POST['reportCourseId']) && $_POST['reportCourseId'] != '') {
    $course = $_POST['reportCourseId'];
    echo "<h2>Student List for Course: " . htmlspecialchars($course) . "</h2>";
    
    $query = "SELECT name, email, rollNo, regNo, semester FROM records WHERE course = '$course'";
    $result = mysqli_query($conn, $query);
    
    echo "<table>
            <tr><th>Roll No</th><th>Reg No</th><th>Student Name</th><th>Email</th><th>Semester</th></tr>";
    if(mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            echo "<tr>
                    <td>{$row['rollNo']}</td>
                    <td>{$row['regNo']}</td>
                    <td>{$row['name']}</td>
                    <td>{$row['email']}</td>
                    <td>Semester {$row['semester']}</td>
                  </tr>";
        }
    } else {
        echo "<tr><td colspan='5' style='text-align:center;'>No records found for this course.</td></tr>";
    }
    echo "</table>";
}

// 2. Student Marks Report
if (isset($_POST['reportStudentId']) && $_POST['reportStudentId'] != '') {
    $student_id = $_POST['reportStudentId'];
    echo "<h2>Academic Marks Report for Student: " . htmlspecialchars($student_id) . "</h2>";
    
    $query = "SELECT subject_id, exam_type, marks_obtained, max_marks, percentage, remarks FROM marks_records WHERE student_id = '$student_id'";
    $result = mysqli_query($conn, $query);
    
    echo "<table>
            <tr><th>Subject</th><th>Exam Type</th><th>Marks Obtained</th><th>Max Marks</th><th>Percentage</th><th>Remarks</th></tr>";
    if(mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            echo "<tr>
                    <td>{$row['subject_id']}</td>
                    <td>{$row['exam_type']}</td>
                    <td>{$row['marks_obtained']}</td>
                    <td>{$row['max_marks']}</td>
                    <td>{$row['percentage']}%</td>
                    <td>{$row['remarks']}</td>
                  </tr>";
        }
    } else {
        echo "<tr><td colspan='6' style='text-align:center;'>No marks records found for this student.</td></tr>";
    }
    echo "</table>";
}

echo "</div>
</body>
</html>";
mysqli_close($conn);
?>
