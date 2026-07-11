<?php
$host = 'localhost';
$user = 'root';
$password  = '';
$database = 'student_db';

$conn = mysqli_connect($host, $user, $password, $database);

if (!$conn) {
    die("Database Connection Failed " . mysqli_connect_error());
}

// echo "Connected Successfully";