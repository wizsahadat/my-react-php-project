<?php
session_start();
require_once '../db.php';
cors();

$action = $_GET['action'] ?? '';
$db = getDB();

// ── LOGIN ──
if ($action === 'login') {
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password) {
        echo json_encode(['success' => false, 'msg' => 'Email ও Password দিন।']); exit;
    }

    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && (password_verify($password, $user['password']) || md5($password) === $user['password'])) {
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['name']    = $user['name'];
        $_SESSION['email']   = $user['email'];
        $_SESSION['role']    = $user['role'];
        echo json_encode([
            'success' => true,
            'name'    => $user['name'],
            'email'   => $user['email'],
            'role'    => $user['role']
        ]);
    } else {
        echo json_encode(['success' => false, 'msg' => 'Email বা Password ভুল।']);
    }
    exit;
}

// ── REGISTER ──
if ($action === 'register') {
    $name     = trim($_POST['name'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $phone    = trim($_POST['phone'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$name || !$email || !$password) {
        echo json_encode(['success' => false, 'msg' => 'সব তথ্য দিন।']); exit;
    }

    $check = $db->prepare("SELECT user_id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        echo json_encode(['success' => false, 'msg' => 'এই Email দিয়ে আগে account আছে।']); exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $db->prepare("INSERT INTO users (name, email, phone, password, role) VALUES (?,?,?,?,'user')")
       ->execute([$name, $email, $phone, $hash]);

    $userId = $db->lastInsertId();
    $_SESSION['user_id'] = $userId;
    $_SESSION['name']    = $name;
    $_SESSION['email']   = $email;
    $_SESSION['role']    = 'user';

    echo json_encode(['success' => true, 'name' => $name, 'email' => $email, 'role' => 'user']);
    exit;
}

// ── LOGOUT ──
if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}

// ── CHECK SESSION ──
if ($action === 'check') {
    if (!empty($_SESSION['user_id'])) {
        echo json_encode([
            'loggedIn' => true,
            'name'     => $_SESSION['name'],
            'email'    => $_SESSION['email'],
            'role'     => $_SESSION['role']
        ]);
    } else {
        echo json_encode(['loggedIn' => false]);
    }
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Invalid action.']);
