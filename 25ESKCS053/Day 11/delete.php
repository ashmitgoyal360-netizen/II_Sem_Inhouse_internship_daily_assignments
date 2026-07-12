<?php
session_start();
require_once 'db.php';

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $id = $_GET['id'];

    $stmt = $pdo->prepare("DELETE FROM students WHERE id = ?");
    try {
        $stmt->execute([$id]);
        $_SESSION['message'] = "Student entry removed successfully.";
        $_SESSION['msg_type'] = "warning";
    } catch (\PDOException $e) {
        $_SESSION['message'] = "Deletion rejected: Error handling query dependency mappings.";
        $_SESSION['msg_type'] = "danger";
    }
}

header("Location: students.php");
exit;
?>