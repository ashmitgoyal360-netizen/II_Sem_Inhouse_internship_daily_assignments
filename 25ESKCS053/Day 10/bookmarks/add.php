<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: ../admin/login.php");
    exit();
}
include __DIR__ . '/db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: index.php");
    exit();
}

$title = trim($_POST['title'] ?? '');
$url = trim($_POST['url'] ?? '');
$category = trim($_POST['category'] ?? '');
$description = trim($_POST['description'] ?? '');

$errors = [];
if (empty($title)) $errors[] = "Title is required.";
if (empty($url)) {
    $errors[] = "URL is required.";
} elseif (!filter_var($url, FILTER_VALIDATE_URL)) {
    $errors[] = "Please enter a valid URL (e.g. https://google.com).";
}

if (empty($category)) {
    $category = 'General';
}

if (!empty($errors)) {
    $_SESSION['errors'] = $errors;
    header("Location: index.php");
    exit();
}

$title = mysqli_real_escape_string($conn, $title);
$url = mysqli_real_escape_string($conn, $url);
$category = mysqli_real_escape_string($conn, $category);
$description = mysqli_real_escape_string($conn, $description);

$query = "INSERT INTO bookmarks (title, url, category, description) VALUES ('$title', '$url', '$category', '$description')";

if (mysqli_query($conn, $query)) {
    $_SESSION['message'] = "Bookmark added successfully!";
} else {
    $_SESSION['errors'] = ["Database error: " . mysqli_error($conn)];
}

header("Location: index.php");
exit();
