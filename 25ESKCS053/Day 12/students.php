<?php
// students.php
require_once 'config.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$message = "";
$messageClass = "";

// Handle Adding a New Student Record
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['add_student'])) {
    $name    = trim($_POST['name']);
    $email   = trim($_POST['email']);
    $branch  = trim($_POST['branch']);
    $course  = trim($_POST['course']);
    $cgpa    = trim($_POST['cgpa']);
    $phone   = trim($_POST['phone']);
    $city    = trim($_POST['city']);
    $address = trim($_POST['address']);
    $status  = $_POST['status'];
    $filename = null; 

    // Handle File Uploads Safely
    if (!empty($_FILES['photo']['name'])) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file = $_FILES['photo'];

        if (!in_array($file['type'], $allowed_types)) {
            $message = "Error: Only JPG, PNG, and GIF images are allowed.";
            $messageClass = "alert-danger";
        } elseif ($file['size'] > 2 * 1024 * 1024) {
            $message = "Error: Max file size allowed is 2MB.";
            $messageClass = "alert-danger";
        } else {
            $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = uniqid('student_') . '.' . $ext;
            $dest = 'uploads/' . $filename;

            if (!is_dir('uploads')) {
                mkdir('uploads', 0777, true);
            }
            move_uploaded_file($file['tmp_name'], $dest);
        }
    }

    if (empty($message)) {
        try {
            $sql = "INSERT INTO students (name, email, branch, course, cgpa, phone, city, photo, address, date_registered, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$name, $email, $branch, $course, $cgpa, $phone, $city, $filename, $address, $status]);
            
            $message = "Success: Student record added successfully!";
            $messageClass = "alert-success";
        } catch (\PDOException $e) {
            $message = "Database Error: " . $e->getMessage();
            $messageClass = "alert-danger";
        }
    }
}

// Multi-Column Search Handling
$search = isset($_GET['q']) ? trim($_GET['q']) : "";

if (!empty($search)) {
    $like = '%' . $search . '%';
    $queryStr = "SELECT * FROM students WHERE name LIKE ? OR branch LIKE ? OR course LIKE ? OR city LIKE ? OR email LIKE ? ORDER BY id DESC";
    $stmt = $pdo->prepare($queryStr);
    $stmt->execute([$like, $like, $like, $like, $like]);
} else {
    $stmt = $pdo->query("SELECT * FROM students ORDER BY id DESC");
}
$students = $stmt->fetchAll();

// Compute Dashboard Metrics
$total = $pdo->query("SELECT COUNT(*) FROM students")->fetchColumn();
$active_count = $pdo->query("SELECT COUNT(*) FROM students WHERE status = 'Active'")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Student Management Dashboard</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
    <style>
        .avatar-img { width: 45px; height: 45px; object-fit: cover; border-radius: 50%; }
        .preview-img { max-width: 100px; max-height: 100px; object-fit: cover; }
    </style>
</head>
<body class="bg-light">

    <!-- Top Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold text-info" href="students.php"><i class="bi bi-mortarboard-fill"></i> Student Management</a>
            <div class="navbar-nav ms-auto">
                <span class="navbar-text me-3 text-white-50">Welcome, <?= htmlspecialchars($_SESSION['user_name']) ?></span>
                <a href="logout.php" class="btn btn-outline-danger btn-sm text-white">Sign Out</a>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <?php if (!empty($message)): ?>
            <div class="alert <?= $messageClass ?> alert-dismissible fade show shadow-sm" role="alert">
                <?= htmlspecialchars($message) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <!-- Statistics Cards -->
        <div class="row g-3 mb-4">
            <div class="col-md-6 col-lg-3">
                <div class="card border-0 shadow-sm p-2">
                    <div class="card-body d-flex align-items-center justify-content-between">
                        <div>
                            <h6 class="text-muted mb-1 small text-uppercase">Total Registered</h6>
                            <h2 class="fw-bold text-primary mb-0"><?= $total ?></h2>
                        </div>
                        <div class="bg-primary bg-opacity-10 p-3 rounded text-primary"><i class="bi bi-people fs-3"></i></div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card border-0 shadow-sm p-2">
                    <div class="card-body d-flex align-items-center justify-content-between">
                        <div>
                            <h6 class="text-muted mb-1 small text-uppercase">Active Status</h6>
                            <h2 class="fw-bold text-success mb-0"><?= $active_count ?></h2>
                        </div>
                        <div class="bg-success bg-opacity-10 p-3 rounded text-success"><i class="bi bi-check2-circle fs-3"></i></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-4">
            <!-- Data Records Grid Table -->
            <div class="col-xl-8">
                <div class="card border-0 shadow-sm p-4 bg-white">
                    <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-grid-3x3-gap-fill"></i> Database Grid View</h5>
                    
                    <form method="GET" action="students.php" class="d-flex mb-3">
                        <input type="search" name="q" class="form-control me-2" placeholder="Search parameters (name, branch, course, city, email)..." value="<?= htmlspecialchars($search) ?>">
                        <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                    </form>

                    <div class="table-responsive">
                        <?php if (count($students) > 0): ?>
                            <table class="table table-striped table-hover align-middle border-top small">
                                <thead class="table-light">
                                    <tr>
                                        <th>Photo</th>
                                        <th>Details</th>
                                        <th>Academic</th>
                                        <th>CGPA</th>
                                        <th>Contact Context</th>
                                        <th>Status</th>
                                        <th class="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($students as $row): 
                                        $photoPath = (!empty($row['photo']) && file_exists('uploads/' . $row['photo'])) ? 'uploads/' . $row['photo'] : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                                    ?>
                                        <tr>
                                            <td><img src="<?= $photoPath ?>" alt="Photo" class="avatar-img border"></td>
                                            <td>
                                                <div class="fw-bold"><?= htmlspecialchars($row['name']) ?></div>
                                                <div class="text-muted text-xs small"><?= htmlspecialchars($row['email']) ?></div>
                                            </td>
                                            <td>
                                                <div class="fw-semibold"><?= htmlspecialchars($row['branch']) ?></div>
                                                <div class="text-xs text-muted"><?= htmlspecialchars($row['course']) ?></div>
                                            </td>
                                            <td class="fw-bold text-dark"><?= htmlspecialchars($row['cgpa']) ?></td>
                                            <td>
                                                <div><i class="bi bi-telephone text-muted"></i> <?= htmlspecialchars($row['phone']) ?></div>
                                                <div class="text-xs text-muted"><i class="bi bi-geo-alt"></i> <?= htmlspecialchars($row['city']) ?></div>
                                            </td>
                                            <td>
                                                <span class="badge <?= $row['status'] === 'Active' ? 'bg-success' : 'bg-secondary' ?> bg-opacity-75">
                                                    <?= htmlspecialchars($row['status'] ?? 'Active') ?>
                                                </span>
                                            </td>
                                            <td class="text-end">
                                                <a href="delete.php?id=<?= $row['id'] ?>" class="btn btn-sm btn-outline-danger" onclick="return confirm('Permanently drop this record?')"><i class="bi bi-trash"></i></a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php else: ?>
                            <div class="text-center py-5 border rounded bg-light">
                                <i class="bi bi-folder-x text-muted fs-1 mb-2"></i>
                                <p class="text-muted fw-bold mb-0">No active records located inside this directory query.</p>
                                <a href="students.php" class="btn btn-sm btn-secondary mt-2">Reset Grid View</a>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Profile Insertion Form Sidebar -->
            <div class="col-xl-4">
                <div class="card border-0 shadow-sm p-4 bg-white">
                    <h5 class="fw-bold mb-3 text-secondary"><i class="bi bi-person-plus-fill"></i> New Profile Ingestion</h5>
                    
                    <form method="POST" enctype="multipart/form-data" action="students.php">
                        <div class="row g-2">
                            <div class="col-sm-6 mb-2">
                                <label class="form-label small fw-bold">Full Name</label>
                                <input type="text" name="name" class="form-control form-control-sm" required>
                            </div>
                            <div class="col-sm-6 mb-2">
                                <label class="form-label small fw-bold">Email Address</label>
                                <input type="email" name="email" class="form-control form-control-sm" required>
                            </div>
                        </div>

                        <div class="row g-2">
                            <div class="col-sm-6 mb-2">
                                <label class="form-label small fw-bold">Branch</label>
                                <input type="text" name="branch" class="form-control form-control-sm" required placeholder="e.g. IT">
                            </div>
                            <div class="col-sm-6 mb-2">
                                <label class="form-label small fw-bold">Course</label>
                                <input type="text" name="course" class="form-control form-control-sm" required placeholder="e.g. B.Tech">
                            </div>
                        </div>

                        <div class="row g-2">
                            <div class="col-sm-6 mb-2">
                                <label class="form-label small fw-bold">Current CGPA</label>
                                <input type="number" step="0.01" name="cgpa" class="form-control form-control-sm" required placeholder="9.85">
                            </div>
                            <div class="col-sm-6 mb-2">
                                <label class="form-label small fw-bold">Phone No.</label>
                                <input type="text" name="phone" class="form-control form-control-sm" required>
                            </div>
                        </div>

                        <div class="mb-2">
                            <label class="form-label small fw-bold">City Location</label>
                            <input type="text" name="city" class="form-control form-control-sm" required>
                        </div>

                        <div class="mb-2">
                            <label class="form-label small fw-bold">Mailing Address</label>
                            <textarea name="address" class="form-control form-control-sm" rows="2" required></textarea>
                        </div>

                        <div class="row g-2 align-items-center mb-3">
                            <div class="col-sm-6">
                                <label class="form-label small fw-bold">System Status</label>
                                <select name="status" class="form-select form-select-sm">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label small fw-bold">Profile Image</label>
                                <input type="file" name="photo" id="photoFile" class="form-control form-control-sm" accept="image/*">
                            </div>
                        </div>

                        <!-- Graphical Image Preview Placeholder -->
                        <div class="mb-3 text-center d-none" id="previewLayout">
                            <img id="viewImg" src="#" alt="Preview" class="preview-img rounded border img-thumbnail">
                        </div>

                        <button type="submit" name="add_student" class="btn btn-success btn-sm w-100 shadow-sm">
                            <i class="bi bi-plus-circle"></i> Complete Registry File
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Automatic script execution to display images live before submission
        document.getElementById('photoFile').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const viewImg = document.getElementById('viewImg');
                    const previewLayout = document.getElementById('previewLayout');
                    viewImg.src = evt.target.result;
                    previewLayout.classList.remove('d-none');
                }
                reader.readAsDataURL(file);
            }
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>