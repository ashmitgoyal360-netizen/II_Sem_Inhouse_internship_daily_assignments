<?php
session_start();
include __DIR__ . "/../common/db_connect.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: students.php');
    exit();
}

$id = (int)($_POST['id'] ?? 0);
if ($id <= 0) {
    $_SESSION['error'] = 'Invalid student ID.';
    header('Location: students.php');
    exit();
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$college = trim($_POST['college'] ?? '');
$branch = trim($_POST['branch'] ?? '');

$errors = [];
if (empty($name)) $errors[] = "Name is required.";
if (empty($email)) $errors[] = "Email is required.";
if (empty($college)) $errors[] = "College is required.";
if (empty($branch)) $errors[] = "Branch is required.";

if (!empty($errors)) {
    $_SESSION['error'] = implode(" ", $errors);
    header("Location: edit_student.php?id=" . $id);
    exit();
}

$name = mysqli_real_escape_string($conn, $name);
$email = mysqli_real_escape_string($conn, $email);
$college = mysqli_real_escape_string($conn, $college);
$branch = mysqli_real_escape_string($conn, $branch);

$sql = "UPDATE students SET 
        name = '$name',
        email = '$email',
        college = '$college',
        branch = '$branch'
        WHERE id = $id";

$res = mysqli_query($conn, $sql);
if ($res) {
    $_SESSION['message'] = 'Student record updated successfully!';
    header('Location: students.php');
} else {
    $_SESSION['error'] = 'Database error occurred: ' . mysqli_error($conn);
    header("Location: edit_student.php?id=" . $id);
}
exit();
