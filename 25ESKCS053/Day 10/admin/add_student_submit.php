<?php
session_start();
include __DIR__ . '/../common/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: students.php");
    exit();
}

$errors = [];
$_SESSION['old'] = $_POST;

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$college = trim($_POST['college'] ?? '');
$branch = trim($_POST['branch'] ?? '');

if (empty($name)) {
    $errors[] = "Name is required";
}
if (empty($email)) {
    $errors[] = "Email is required";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}
if (empty($college)) {
    $errors[] = "College is required";
}
if (empty($branch)) {
    $errors[] = "Branch is required";
}

if (!empty($errors)) {
    $_SESSION['errors'] = $errors;
    header("Location: add_student.php");
    exit();
}

$name = mysqli_real_escape_string($conn, $name);
$email = mysqli_real_escape_string($conn, $email);
$college = mysqli_real_escape_string($conn, $college);
$branch = mysqli_real_escape_string($conn, $branch);

$sql = "INSERT INTO students (name, email, college, branch) VALUES ('$name', '$email', '$college', '$branch')";

if (mysqli_query($conn, $sql)) {
    $_SESSION['message'] = "Student registered successfully!";
    unset($_SESSION['old']);
    header("Location: students.php");
} else {
    $_SESSION['errors'] = ["Database error occurred: " . mysqli_error($conn)];
    header("Location: add_student.php");
}
exit();
