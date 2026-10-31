<?php
/* ============================================================
   install.php — Script d'installation automatique
   Crée la base, les tables et l'utilisateur admin.
   ⚠️ SUPPRIMEZ CE FICHIER APRÈS L'INSTALLATION !
   ============================================================ */

// Connexion sans base de données
$host = 'localhost';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Créer la base
    $pdo->exec("CREATE DATABASE IF NOT EXISTS autopièces_db
                CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE autopièces_db");

    // Table users
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role ENUM('admin', 'staff') DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Table parts
    $pdo->exec("CREATE TABLE IF NOT EXISTS parts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(50) NOT NULL UNIQUE,
        category VARCHAR(100) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        quantity INT NOT NULL DEFAULT 0,
        description TEXT,
        compatible TEXT,
        model3d VARCHAR(255) DEFAULT '',
        image VARCHAR(500) DEFAULT '',
        location_room VARCHAR(50) DEFAULT '',
        location_shelf VARCHAR(50) DEFAULT '',
        location_level INT DEFAULT 1,
        location_box INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Créer l'utilisateur admin avec un VRAI hash
    $adminPassword = 'admin123';
    $hash = password_hash($adminPassword, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (username, password, full_name, role)
                           VALUES (?, ?, ?, 'admin')
                           ON DUPLICATE KEY UPDATE password = ?");
    $stmt->execute(['admin', $hash, 'Administrateur', $hash]);

    echo "<h1>✅ Installation réussie !</h1>";
    echo "<p>Base de données : <strong>autopièces_db</strong></p>";
    echo "<p>Utilisateur : <strong>admin</strong> / Mot de passe : <strong>admin123</strong></p>";
    echo "<p style='color:red;'><strong>⚠️ SUPPRIMEZ install.php maintenant !</strong></p>";
    echo "<p><a href='login.php'>Aller à la page de connexion</a></p>";

} catch (PDOException $e) {
    die("❌ Erreur : " . $e->getMessage());
}