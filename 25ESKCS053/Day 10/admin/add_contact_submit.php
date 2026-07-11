<?php
session_start();
include __DIR__ . '/../common/db_connect.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: contacts.php");
    exit();
}

$errors = [];
$name = trim($_POST['name'] ?? '');
$mail = trim($_POST['mail'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$college = trim($_POST['college'] ?? '');
$semester = trim($_POST['semester'] ?? '');
$city = trim($_POST['city'] ?? '');
$queries = trim($_POST['queries'] ?? '');

// Validation
if (empty($name)) $errors[] = "Name is required.";
if (empty($mail)) {
    $errors[] = "Email is required.";
} elseif (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format.";
}
if (empty($phone)) $errors[] = "Mobile number is required.";
if (empty($college)) $errors[] = "College is required.";
if (empty($semester)) $errors[] = "Class / Semester is required.";
if (empty($city)) $errors[] = "City is required.";
if (empty($queries)) $errors[] = "Queries / message is required.";

if (!empty($errors)) {
    $_SESSION['errors'] = $errors;
    $_SESSION['old'] = $_POST;
    header("Location: add_contact.php");
    exit();
}

// Sanitize inputs
$name = mysqli_real_escape_string($conn, $name);
$mail = mysqli_real_escape_string($conn, $mail);
$phone = mysqli_real_escape_string($conn, $phone);
$college = mysqli_real_escape_string($conn, $college);
$semester = mysqli_real_escape_string($conn, $semester);
$city = mysqli_real_escape_string($conn, $city);
$queries = mysqli_real_escape_string($conn, $queries);

$sql = "INSERT INTO contact_us (name, mail, phone, college, semester, city, queries, is_read) 
        VALUES ('$name', '$mail', '$phone', '$college', '$semester', '$city', '$queries', 0)";

if (mysqli_query($conn, $sql)) {
    $_SESSION['message'] = "Contact entry added successfully!";
    header("Location: contacts.php");
} else {
    $_SESSION['errors'] = ["Database error: " . mysqli_error($conn)];
    $_SESSION['old'] = $_POST;
    header("Location: add_contact.php");
}
exit();
