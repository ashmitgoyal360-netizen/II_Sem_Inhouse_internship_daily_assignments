<?php
session_start();
include __DIR__ . '/common/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: index.php#contact");
    exit();
}

$errors = [];
$_SESSION['contact_old'] = $_POST;

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$college = trim($_POST['college'] ?? '');
$semester = trim($_POST['semester'] ?? '');
$city = trim($_POST['city'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name)) {
    $errors[] = "Name is required";
}
if (empty($email)) {
    $errors[] = "Email is required";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}
if (empty($phone)) {
    $errors[] = "Mobile number is required";
}
if (empty($message)) {
    $errors[] = "Message/Queries is required";
}

if (!empty($errors)) {
    $_SESSION['contact_errors'] = $errors;
    header("Location: index.php#contact");
    exit();
}

$name = mysqli_real_escape_string($conn, $name);
$email = mysqli_real_escape_string($conn, $email);
$phone = mysqli_real_escape_string($conn, $phone);
$college = mysqli_real_escape_string($conn, $college);
$semester = mysqli_real_escape_string($conn, $semester);
$city = mysqli_real_escape_string($conn, $city);
$message = mysqli_real_escape_string($conn, $message);

$sql = "INSERT INTO contact_us (name, mail, phone, college, semester, city, queries) 
        VALUES ('$name', '$email', '$phone', '$college', '$semester', '$city', '$message')";

if (mysqli_query($conn, $sql)) {
    $_SESSION['contact_success'] = "Thank you! Your message has been received.";
    unset($_SESSION['contact_old']);
} else {
    $_SESSION['contact_errors'] = ["Database error occurred: " . mysqli_error($conn)];
}

header("Location: index.php#contact");
exit();
