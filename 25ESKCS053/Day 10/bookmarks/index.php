<?php
session_start();
include __DIR__ . '/db_connect.php';

// Auth Guard Check
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: ../admin/login.php");
    exit();
}

// Fetch all distinct categories for filtering
$category_query = "SELECT DISTINCT category FROM bookmarks ORDER BY category ASC";
$category_result = mysqli_query($conn, $category_query);
$categories = [];
if ($category_result) {
    while ($cat = mysqli_fetch_assoc($category_result)) {
        if (!empty($cat['category'])) {
            $categories[] = $cat['category'];
        }
    }
}

// Fetch bookmarks
$query = "SELECT * FROM bookmarks ORDER BY id DESC";
$result = mysqli_query($conn, $query);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sleek Bookmarks</title>
    <!-- FontAwesome CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <!-- User Info & Logout Top Bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; background: var(--card-bg); border: 1px solid var(--card-border); padding: 0.75rem 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
        <span style="font-size: 0.95rem; font-weight: 500; color: var(--text-primary);">
            <i class="fas fa-user-circle" style="color: var(--accent-color); margin-right: 0.5rem;"></i>
            Logged in as: <strong><?php echo htmlspecialchars($_SESSION['admin_name'] ?? 'Admin'); ?></strong>
        </span>
        <a href="../admin/logout.php" class="btn btn-danger btn-sm" style="padding: 0.4rem 1rem; font-size: 0.85rem; border-radius: 8px;">
            <i class="fas fa-sign-out-alt"></i> Logout
        </a>
    </div>

    <header>
        <h1>Sleek Bookmarks</h1>
        <p>Your curated directory of the web, stored securely in the database</p>
    </header>

    <!-- Success & Error Alerts -->
    <?php if (isset($_SESSION['message'])) { ?>
        <div style="background: rgba(16, 185, 129, 0.2); border: 1px solid var(--success-color); color: #fff; padding: 1rem; border-radius: 12px; margin-bottom: 2rem; text-align: center;">
            <i class="fas fa-check-circle"></i> <?php echo htmlspecialchars($_SESSION['message']); ?>
        </div>
    <?php unset($_SESSION['message']); } ?>

    <?php if (isset($_SESSION['errors']) && !empty($_SESSION['errors'])) { ?>
        <div style="background: rgba(239, 68, 68, 0.2); border: 1px solid var(--danger-color); color: #fff; padding: 1rem; border-radius: 12px; margin-bottom: 2rem;">
            <ul style="margin: 0; padding-left: 1.2rem;">
                <?php foreach ($_SESSION['errors'] as $error) { ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php } ?>
            </ul>
        </div>
    <?php unset($_SESSION['errors']); } ?>

    <!-- Controls Bar -->
    <div class="controls-bar">
        <!-- Search -->
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="Search title, URL, description..." onkeyup="filterBookmarks()">
        </div>

        <!-- Categories Filter -->
        <div class="categories-filter">
            <span class="category-tag active" onclick="selectCategory('All', this)">All</span>
            <?php foreach ($categories as $cat) { ?>
                <span class="category-tag" onclick="selectCategory('<?php echo htmlspecialchars($cat); ?>', this)">
                    <?php echo htmlspecialchars($cat); ?>
                </span>
            <?php } ?>
        </div>

        <!-- Add Button -->
        <button class="btn" onclick="openAddModal()">
            <i class="fas fa-plus"></i> Add Bookmark
        </button>
    </div>

    <!-- Bookmarks Grid -->
    <div class="bookmarks-grid" id="bookmarksGrid">
        <?php 
        $has_bookmarks = false;
        if ($result && mysqli_num_rows($result) > 0) {
            $has_bookmarks = true;
            while ($row = mysqli_fetch_assoc($result)) {
        ?>
            <div class="bookmark-card" data-category="<?php echo htmlspecialchars($row['category']); ?>">
                <div class="bookmark-header">
                    <span class="bookmark-category"><?php echo htmlspecialchars($row['category']); ?></span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">
                        <?php echo date('M d, Y', strtotime($row['created_at'])); ?>
                    </span>
                </div>
                <div>
                    <h3 class="bookmark-title"><?php echo htmlspecialchars($row['title']); ?></h3>
                    <p class="bookmark-desc"><?php echo htmlspecialchars($row['description']); ?></p>
                </div>
                <div class="bookmark-actions">
                    <a href="<?php echo htmlspecialchars($row['url']); ?>" target="_blank" class="bookmark-link">
                        Open Link <i class="fas fa-external-link-alt"></i>
                    </a>
                    <div class="action-buttons">
                        <button class="icon-btn" onclick="openEditModal(<?php echo htmlspecialchars(json_encode($row)); ?>)">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="icon-btn delete" onclick="confirmDelete(<?php echo $row['id']; ?>)">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        <?php 
            }
        }
        
        if (!$has_bookmarks) {
        ?>
            <div class="empty-state" id="emptyState">
                <i class="far fa-bookmark"></i>
                <p>No bookmarks found. Get started by adding one!</p>
                <button class="btn" onclick="openAddModal()">Add Your First Bookmark</button>
            </div>
        <?php } else { ?>
            <div class="empty-state" id="emptyState" style="display: none;">
                <i class="far fa-bookmark"></i>
                <p>No bookmarks match your search or filter.</p>
            </div>
        <?php } ?>
    </div>
</div>

<!-- Add Bookmark Modal -->
<div class="modal-overlay" id="addModal">
    <div class="modal-content">
        <h3>Add New Bookmark</h3>
        <form action="add.php" method="POST">
            <div class="form-group">
                <label for="addTitle">Title</label>
                <input type="text" id="addTitle" name="title" required placeholder="Google, GitHub, etc.">
            </div>
            <div class="form-group">
                <label for="addUrl">URL</label>
                <input type="url" id="addUrl" name="url" required placeholder="https://example.com">
            </div>
            <div class="form-group">
                <label for="addCategory">Category</label>
                <input type="text" id="addCategory" name="category" placeholder="General, Dev, Learning..." list="existingCategories">
                <datalist id="existingCategories">
                    <?php foreach ($categories as $cat) { ?>
                        <option value="<?php echo htmlspecialchars($cat); ?>">
                    <?php } ?>
                </datalist>
            </div>
            <div class="form-group">
                <label for="addDescription">Description</label>
                <textarea id="addDescription" name="description" rows="3" placeholder="Useful tools, developer platform, etc."></textarea>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeAddModal()">Cancel</button>
                <button type="submit" class="btn">Add Bookmark</button>
            </div>
        </form>
    </div>
</div>

<!-- Edit Bookmark Modal -->
<div class="modal-overlay" id="editModal">
    <div class="modal-content">
        <h3>Edit Bookmark</h3>
        <form action="edit.php" method="POST">
            <input type="hidden" id="editId" name="id">
            <div class="form-group">
                <label for="editTitle">Title</label>
                <input type="text" id="editTitle" name="title" required>
            </div>
            <div class="form-group">
                <label for="editUrl">URL</label>
                <input type="url" id="editUrl" name="url" required>
            </div>
            <div class="form-group">
                <label for="editCategory">Category</label>
                <input type="text" id="editCategory" name="category" placeholder="General, Dev, Learning...">
            </div>
            <div class="form-group">
                <label for="editDescription">Description</label>
                <textarea id="editDescription" name="description" rows="3"></textarea>
            </div>
            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
                <button type="submit" class="btn">Save Changes</button>
            </div>
        </form>
    </div>
</div>

<script>
    let activeCategory = 'All';

    // Modal Control
    function openAddModal() {
        document.getElementById('addModal').classList.add('active');
    }
    function closeAddModal() {
        document.getElementById('addModal').classList.remove('active');
    }
    function openEditModal(bookmark) {
        document.getElementById('editId').value = bookmark.id;
        document.getElementById('editTitle').value = bookmark.title;
        document.getElementById('editUrl').value = bookmark.url;
        document.getElementById('editCategory').value = bookmark.category;
        document.getElementById('editDescription').value = bookmark.description;
        document.getElementById('editModal').classList.add('active');
    }
    function closeEditModal() {
        document.getElementById('editModal').classList.remove('active');
    }

    // Deletion
    function confirmDelete(id) {
        if (confirm("Are you sure you want to delete this bookmark?")) {
            window.location.href = 'delete.php?id=' + id;
        }
    }

    // Dynamic Filter
    function selectCategory(category, element) {
        // Update active class on category tags
        document.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
        element.classList.add('active');
        
        activeCategory = category;
        filterBookmarks();
    }

    function filterBookmarks() {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const cards = document.querySelectorAll('.bookmark-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('.bookmark-title').innerText.toLowerCase();
            const desc = card.querySelector('.bookmark-desc').innerText.toLowerCase();
            const link = card.querySelector('.bookmark-link').getAttribute('href').toLowerCase();

            const matchesCategory = (activeCategory === 'All' || category === activeCategory);
            const matchesSearch = (title.includes(searchQuery) || desc.includes(searchQuery) || link.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle Empty State message
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            if (visibleCount === 0) {
                emptyState.style.display = 'block';
            } else {
                emptyState.style.display = 'none';
            }
        }
    }
</script>

</body>
</html>
