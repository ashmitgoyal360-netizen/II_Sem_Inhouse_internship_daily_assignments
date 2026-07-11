<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: ../admin/login.php");
    exit();
}
include __DIR__ . '/db_connect.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    $_SESSION['errors'] = ["Invalid bookmark ID."];
    header("Location: index.php");
    exit();
}

$id = (int)$_GET['id'];

$query = "DELETE FROM bookmarks WHERE id = $id";

if (mysqli_query($conn, $query)) {
    $_SESSION['message'] = "Bookmark deleted successfully!";
} else {
    $_SESSION['errors'] = ["Database error: " . mysqli_error($conn)];
}

header("Location: index.php");
exit();
