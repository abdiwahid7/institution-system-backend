<?php
include '../includes/session.php';
include '../includes/db.php';

if (!isAdmin()) {
    header('Location: ../index.php');
    exit();
}

$postsCount = $conn->query("SELECT COUNT(*) FROM posts")->fetchColumn();
$usersCount = $conn->query("SELECT COUNT(*) FROM users")->fetchColumn();
$categoriesCount = $conn->query("SELECT COUNT(*) FROM categories")->fetchColumn();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <header>
        <div class="logo">
            <h1>Admin Dashboard</h1>
        </div>
        <nav>
            <ul>
                <li><a href="index.php">Dashboard</a></li>
                <li><a href="manage_posts.php">Manage Posts</a></li>
                <li><a href="manage_users.php">Manage Users</a></li>
                <li><a href="manage_categories.php">Manage Categories</a></li>
                <li><a href="../auth/logout.php">Logout</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="dashboard-stats">
            <div class="stat">
                <h2>Total Posts</h2>
                <p><?php echo $postsCount; ?></p>
            </div>
            <div class="stat">
                <h2>Total Users</h2>
                <p><?php echo $usersCount; ?></p>
            </div>
            <div class="stat">
                <h2>Total Categories</h2>
                <p><?php echo $categoriesCount; ?></p>
            </div>
        </div>

        <div class="quick-actions">
            <h3>Quick Actions</h3>
            <ul>
                <li><a href="manage_posts.php">View and Edit Posts</a></li>
                <li><a href="manage_users.php">Manage Users</a></li>
                <li><a href="manage_categories.php">Manage Categories</a></li>
                <li><a href="../pages/create_post.php">Create New Post</a></li>
                <li><a href="create_category.php">Add New Category</a></li>
            </ul>
        </div>
    </main>

    <footer>
        <p>&copy; 2025 My Blog. All Rights Reserved.</p>
    </footer>
</body>
</html>