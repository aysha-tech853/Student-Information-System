<?php
include 'db.php';

if($_SERVER["REQUEST_METHOD"]=="POST") {
    $rollNo =$_POST['rollNo'];
    $regNo = $_POST['regNo'];
    $name = $_POST['name'];
    $course = $_POST['course'];
    $semester = $_POST['semester'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
   $sql="INSERT INTO records (rollNo, regNo, name, course, semester, email, phone) VALUES ( '$rollNo', 
   '$regNo', '$name', '$course', '$semester', '$email','$phone')"; 

     if(mysqli_query($conn,$sql)) {
        echo "<script>alert('Data Saved Sucessfully!');
        window.location.href='index.html';</script>";

     }else{
        echo "Error:" . mysqli_error($conn);
       }
     }
     ?>


