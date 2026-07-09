<?php
session_start();
require_once '../db.php';
cors();

$db = getDB();
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($action === 'list') {
    $stmt = $db->prepare("SELECT user_id,name,email,phone,role,created_at FROM users ORDER BY created_at DESC");
    $stmt->execute();
    echo json_encode(['success'=>true,'users'=>$stmt->fetchAll()]); exit;
}

if ($action === 'delete') {
    if (empty($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        echo json_encode(['success'=>false,'msg'=>'Admin only']); exit;
    }
    $db->prepare("DELETE FROM users WHERE user_id=? AND role!='admin'")->execute([$input['user_id']]);
    echo json_encode(['success'=>true]); exit;
}
