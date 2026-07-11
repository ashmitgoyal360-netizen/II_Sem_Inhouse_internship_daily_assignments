<?php
session_start();
include __DIR__ . "/../common/db_connect.php";

if (!isset($_GET['id']) || empty($_GET['id'])) {
    $_SESSION['error'] = 'Invalid student ID.';
    header('Location: students.php');
    exit();
}

$id = (int)$_GET['id'];

$sql = "DELETE from students where id = $id";
$res = mysqli_query($conn, $sql);

if ($res) {
    $_SESSION['message'] = 'Student record deleted successfully!';
} else {
    $_SESSION['error'] = 'Failed to delete student record: ' . mysqli_error($conn);
}

header('Location: students.php');
exit();
