<?php
session_start();
require_once 'db.php';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    header("Location: students.php");
    exit;
}

$id = $_GET['id'];
$stmt = $pdo->prepare("SELECT * FROM students WHERE id = ?");
$stmt->execute([$id]);
$student = $stmt->fetch();

if (!$student) {
    header("Location: students.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $branch = trim($_POST['branch']);
    $course = trim($_POST['course']);
    $cgpa = floatval($_POST['cgpa']);
    $phone = trim($_POST['phone']);
    $city = trim($_POST['city']);
    $address = trim($_POST['address']);
    $status = $_POST['status'];

    $updateStmt = $pdo->prepare("UPDATE students SET name=?, email=?, branch=?, course=?, cgpa=?, phone=?, city=?, address=?, status=? WHERE id=?");
    try {
        $updateStmt->execute([$name, $email, $branch, $course, $cgpa, $phone, $city, $address, $status, $id]);
        $_SESSION['message'] = "Student records updated successfully.";
        $_SESSION['msg_type'] = "success";
        header("Location: students.php");
        exit;
    } catch (\PDOException $e) {
        $_SESSION['message'] = "Error updating database entry: " . $e->getMessage();
        $_SESSION['msg_type'] = "danger";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Student</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container my-5" style="max-width: 700px;">
    <div class="card shadow-sm border-0">
        <div class="card-header bg-primary text-white p-3"><h5 class="mb-0">Modify Student Profile</h5></div>
        <div class="card-body p-4">
            <form action="edit.php?id=<?= $student['id']; ?>" method="POST" class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Full Name</label>
                    <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($student['name']); ?>" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-control" value="<?= htmlspecialchars($student['email']); ?>" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Phone</label>
                    <input type="text" name="phone" class="form-control" value="<?= htmlspecialchars($student['phone']); ?>">
                </div>
                <div class="col-md-6">
                    <label class="form-label">City</label>
                    <input type="text" name="city" class="form-control" value="<?= htmlspecialchars($student['city']); ?>">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Branch</label>
                    <input type="text" name="branch" class="form-control" value="<?= htmlspecialchars($student['branch']); ?>">
                </div>
                <div class="col-md-5">
                    <label class="form-label">Course</label>
                    <input type="text" name="course" class="form-control" value="<?= htmlspecialchars($student['course']); ?>">
                </div>
                <div class="col-md-2">
                    <label class="form-label">CGPA</label>
                    <input type="number" step="0.01" min="0" max="10" name="cgpa" class="form-control" value="<?= htmlspecialchars($student['cgpa']); ?>">
                </div>
                <div class="col-12">
                    <label class="form-label">Address</label>
                    <textarea name="address" class="form-control" rows="2"><?= htmlspecialchars($student['address']); ?></textarea>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select name="status" class="form-select">
                        <option value="Active" <?= $student['status'] === 'Active' ? 'selected' : ''; ?>>Active</option>
                        <option value="Inactive" <?= $student['status'] === 'Inactive' ? 'selected' : ''; ?>>Inactive</option>
                    </select>
                </div>
                <div class="col-12 mt-4 d-flex gap-2">
                    <button type="submit" class="btn btn-success px-4">Update Student</button>
                    <a href="students.php" class="btn btn-outline-secondary">Cancel</a>
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>