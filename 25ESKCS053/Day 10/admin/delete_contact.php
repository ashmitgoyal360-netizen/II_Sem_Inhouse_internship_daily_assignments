<?php
session_start();
include __DIR__ . '/../common/db_connect.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    $_SESSION['error'] = 'Invalid contact ID.';
    header('Location: contacts.php');
    exit();
}

$id = (int)$_GET['id'];

$sql = "DELETE FROM contact_us WHERE id = $id";
$res = mysqli_query($conn, $sql);

if ($res) {
    $_SESSION['message'] = 'Message deleted successfully!';
} else {
    $_SESSION['error'] = 'Failed to delete message: ' . mysqli_error($conn);
}

header('Location: contacts.php');
exit();
