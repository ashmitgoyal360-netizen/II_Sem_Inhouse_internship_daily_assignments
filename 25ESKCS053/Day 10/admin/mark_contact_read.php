<?php
session_start();
include __DIR__ . '/../common/db_connect.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    $_SESSION['error'] = 'Invalid contact ID.';
    header('Location: contacts.php');
    exit();
}

$id = (int)$_GET['id'];

$sql = "UPDATE contact_us SET is_read = 1 WHERE id = $id";
$res = mysqli_query($conn, $sql);

if ($res) {
    $_SESSION['message'] = 'Message marked as read successfully!';
} else {
    $_SESSION['error'] = 'Failed to update message status: ' . mysqli_error($conn);
}

header('Location: contacts.php');
exit();
