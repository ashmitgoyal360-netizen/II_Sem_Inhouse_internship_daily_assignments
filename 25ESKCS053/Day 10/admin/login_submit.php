<?php
session_start();
include __DIR__ . '/../common/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: login.php");
    exit();
}

$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (empty($email) || empty($password)) {
    $_SESSION['error'] = "Email and Password are required.";
    $_SESSION['old_email'] = $email;
    header("Location: login.php");
    exit();
}

$email_escaped = mysqli_real_escape_string($conn, $email);
$password_escaped = mysqli_real_escape_string($conn, $password);

$query = "SELECT * FROM admin WHERE email = '$email_escaped' AND password = '$password_escaped' LIMIT 1";
$result = mysqli_query($conn, $query);

if ($result && mysqli_num_rows($result) > 0) {
    $admin = mysqli_fetch_assoc($result);
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_name'] = $admin['Name'] ?? $admin['name'] ?? $admin['NAME'] ?? 'Admin';
    
    // Clear any login errors
    unset($_SESSION['error'], $_SESSION['old_email']);
    
    // Redirect to students.php
    header("Location: students.php");
} else {
    $_SESSION['error'] = "Invalid email or password.";
    $_SESSION['old_email'] = $email;
    header("Location: login.php");
}
exit();
