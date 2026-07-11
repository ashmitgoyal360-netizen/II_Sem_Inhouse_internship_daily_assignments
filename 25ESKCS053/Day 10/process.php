<?php
session_start();
include __DIR__ . "/common/db_connect.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: register.php");
    exit();
}

$errors = [];
$_SESSION['old'] = $_POST;

// Validation
if (empty(trim($_POST['name'] ?? ''))) {
    $errors[] = "Name is required";
}

if (empty(trim($_POST['email'] ?? ''))) {
    $errors[] = "Email is required";
} elseif (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}

if (empty(trim($_POST['college'] ?? ''))) {
    $errors[] = "College is required";
}

if (empty(trim($_POST['branch'] ?? ''))) {
    $errors[] = "Branch is required";
}

// If error
if (!empty($errors)) {
    $_SESSION['errors'] = $errors;
    header("Location: register.php");
    exit();
}

// Insert Data
$name = mysqli_real_escape_string($conn, $_POST['name']);
$email = mysqli_real_escape_string($conn, $_POST['email']);
$college = mysqli_real_escape_string($conn, $_POST['college']);
$branch = mysqli_real_escape_string($conn, $_POST['branch']);

$sql = "INSERT INTO students (name, email, college, branch)
        VALUES ('$name', '$email', '$college', '$branch')";

if (mysqli_query($conn, $sql)) {
    $_SESSION['success'] = "Student registered successfully!";
    unset($_SESSION['old']);
} else {
    $_SESSION['errors'][] = "Database error occurred: " . mysqli_error($conn);
}

header("Location: register.php");
exit();
