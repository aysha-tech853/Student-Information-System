<?php
$servername ="localhost";
$username = "root";
$password = "";
$dbname = "student_db";
// Connection banana
$conn= mysqli_connect($servername,$username,$password,$dbname);

// Connection check karna
if(!$conn) {
    die("Connection failed:" . mysqli_connect_error());
}
?>