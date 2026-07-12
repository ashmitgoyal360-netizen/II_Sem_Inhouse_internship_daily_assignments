<?php
// delete.php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

if (isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    
    // Optional: Fetch file metadata to scrub old images from filesystem storage
    $stmt = $pdo->prepare("SELECT photo FROM students WHERE id = ?");
    $stmt->execute([$id]);
    $student = $stmt->fetch();
    
    if ($student && !empty($student['photo'])) {
        $filePath = 'uploads/' . $student['photo'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    $delete = $pdo->prepare("DELETE FROM students WHERE id = ?");
    $delete->execute([$id]);
}

header("Location: students.php");
exit;
?>