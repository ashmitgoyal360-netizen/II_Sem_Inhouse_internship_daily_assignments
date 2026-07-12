<?php
session_start();
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $branch = trim($_POST['branch']);
    $course = trim($_POST['course']);
    $cgpa = floatval($_POST['cgpa']);
    $phone = trim($_POST['phone']);
    $city = trim($_POST['city']);
    $address = trim($_POST['address']);
    $status = $_POST['status']; // Active or Inactive

    // Basic Validation Check
    if (empty($name) || empty($email)) {
        $_SESSION['message'] = "Name and Email fields are required.";
        $_SESSION['msg_type'] = "danger";
    } else {
        $stmt = $pdo->prepare("INSERT INTO students (name, email, branch, course, cgpa, phone, city, address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        try {
            $stmt->execute([$name, $email, $branch, $course, $cgpa, $phone, $city, $address, $status]);
            $_SESSION['message'] = "New student entry added successfully!";
            $_SESSION['msg_type'] = "success";
            header("Location: students.php");
            exit;
        } catch (\PDOException $e) {
            $_SESSION['message'] = "Database Error: " . $e->getMessage();
            $_SESSION['msg_type'] = "danger";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Student</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container my-5" style="max-width: 700px;">
    <div class="card shadow-sm border-0">
        <div class="card-header bg-dark text-white p-3"><h5 class="mb-0">Add Student Registration Entry</h5></div>
        <div class="card-body p-4">
            <form action="add.php" method="POST" class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Full Name</label>
                    <input type="text" name="name" class="form-control" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Email Address</label>
                    <input type="email" name="email" class="form-control" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Phone Number</label>
                    <input type="text" name="phone" class="form-control">
                </div>
                <div class="col-md-6">
                    <label class="form-label">City</label>
                    <input type="text" name="city" class="form-control">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Branch</label>
                    <input type="text" name="branch" class="form-control">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Course</label>
                    <input type="text" name="course" class="form-control">
                </div>
                <div class="col-md-2">
                    <label class="form-label">CGPA</label>
                    <input type="number" step="0.01" min="0" max="10" name="cgpa" class="form-control" value="0.00">
                </div>
                <div class="col-12">
                    <label class="form-label">Full Address</label>
                    <textarea name="address" class="form-control" rows="2"></textarea>
                </div>
                <div class="col-md-6">
                    <label class="form-label">System Status</label>
                    <select name="status" class="form-select">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <div class="col-12 mt-4 d-flex gap-2">
                    <button type="submit" class="btn btn-primary px-4">Save Student</button>
                    <a href="students.php" class="btn btn-outline-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>