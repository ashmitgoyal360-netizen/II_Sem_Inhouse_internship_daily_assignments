<?php
session_start();
require_once 'db.php';

$search = isset($_GET['search']) ? trim($_GET['search']) : '';

// Search filters across name, branch, or course
if ($search !== '') {
    $stmt = $pdo->prepare("SELECT * FROM students WHERE name LIKE :search OR branch LIKE :search OR course LIKE :search ORDER BY id DESC");
    $stmt->execute(['search' => "%$search%"]);
} else {
    $stmt = $pdo->query("SELECT * FROM students ORDER BY id DESC");
}
$students = $stmt->fetchAll();

$countStmt = $pdo->query("SELECT COUNT(*) as total FROM students");
$totalStudents = $countStmt->fetch()['total'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Management Portal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        .highlight { background-color: #fff3cd; padding: 2px; border-radius: 3px; }
    </style>
</head>
<body class="bg-light">

<div class="container-fluid px-4 my-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="text-dark fw-bold">Student Management Portal</h2>
            <p class="text-muted mb-0">Live Database Panel</p>
        </div>
        <a href="add.php" class="btn btn-primary"><i class="bi bi-person-plus-fill me-2"></i>Add Student</a>
    </div>

    <?php if (isset($_SESSION['message'])): ?>
        <div class="alert alert-<?= $_SESSION['msg_type']; ?> alert-dismissible fade show dynamic-alert" role="alert">
            <?= $_SESSION['message']; ?>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <?php unset($_SESSION['message']); unset($_SESSION['msg_type']); ?>
    <?php endif; ?>

    <div class="card shadow-sm border-0 mb-4">
        <div class="card-body row align-items-center">
            <div class="col-md-8">
                <form action="students.php" method="GET" class="d-flex gap-2">
                    <input type="text" name="search" class="form-control" placeholder="Search by name, branch, or course..." value="<?= htmlspecialchars($search); ?>">
                    <button type="submit" class="btn btn-dark px-4">Search</button>
                    <?php if ($search !== ''): ?>
                        <a href="students.php" class="btn btn-outline-secondary">Clear</a>
                    <?php endif; ?>
                </form>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
                <span class="badge bg-info text-dark px-3 py-2 fs-6">Total Students: <?= $totalStudents; ?></span>
            </div>
        </div>
    </div>

    <div class="card shadow-sm border-0">
        <div class="table-responsive">
            <table class="table table-hover table-striped align-middle mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Branch & Course</th>
                        <th>City</th>
                        <th>CGPA</th>
                        <th>Status</th>
                        <th class="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($students)): ?>
                        <tr>
                            <td colspan="9" class="text-center py-5 text-muted">No matching records found.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($students as $row): ?>
                            <tr>
                                <td><?= $row['id']; ?></td>
                                <td class="fw-semibold"><?= htmlspecialchars($row['name']); ?></td>
                                <td><?= htmlspecialchars($row['email']); ?></td>
                                <td><?= htmlspecialchars($row['phone']); ?></td>
                                <td>
                                    <small class="text-muted d-block">Branch: <?= htmlspecialchars($row['branch']); ?></small>
                                    <small class="text-muted d-block">Course: <?= htmlspecialchars($row['course']); ?></small>
                                </td>
                                <td><?= htmlspecialchars($row['city']); ?></td>
                                <td><span class="badge bg-light text-dark border"><?= number_format($row['cgpa'], 2); ?></span></td>
                                <td>
                                    <span class="badge bg-<?= $row['status'] === 'Active' ? 'success' : 'secondary'; ?>">
                                        <?= $row['status']; ?>
                                    </span>
                                </td>
                                <td class="text-center">
                                    <div class="btn-group btn-group-sm">
                                        <a href="edit.php?id=<?= $row['id']; ?>" class="btn btn-outline-primary">Edit</a>
                                        <a href="delete.php?id=<?= $row['id']; ?>" class="btn btn-outline-danger" onclick="return confirm('Delete <?= htmlspecialchars($row['name']); ?>?')">Delete</a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
setTimeout(() => {
    document.querySelectorAll('.dynamic-alert').forEach(alert => {
        new bootstrap.Alert(alert).close();
    });
}, 3000);
</script>
</body>
</html>