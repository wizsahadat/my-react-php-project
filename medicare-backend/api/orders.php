<?php
session_start();
require_once '../db.php';
cors();

$db     = getDB();
$action = $_GET['action'] ?? '';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

// ── PLACE ORDER ──
if ($action === 'place') {
    $userId  = $_SESSION['user_id'] ?? null;
    $name    = trim($input['name'] ?? '');
    $phone   = trim($input['phone'] ?? '');
    $address = trim($input['address'] ?? '');
    $notes   = trim($input['notes'] ?? '');
    $payment = ($input['payment_method'] ?? 'cod') === 'bkash' ? 'bkash' : 'cod';
    $items   = $input['items'] ?? [];

    if (!$name || !$phone || !$address || empty($items)) {
        echo json_encode(['success' => false, 'msg' => 'সব তথ্য দিন।']); exit;
    }

    $total = array_sum(array_map(fn($i) => $i['price'] * $i['qty'], $items));

    $db->prepare("INSERT INTO orders (user_id, name, phone, address, notes, payment_method, total, status, created_at) VALUES (?,?,?,?,?,?,?,'pending',NOW())")
       ->execute([$userId, $name, $phone, $address, $notes, $payment, $total]);
    $orderId = $db->lastInsertId();

    foreach ($items as $item) {
        $db->prepare("INSERT INTO order_items (order_id, medicine_id, name, price, qty) VALUES (?,?,?,?,?)")
           ->execute([$orderId, $item['medicine_id'], $item['name'], $item['price'], $item['qty']]);
    }

    // Cart clear
    $_SESSION['cart'] = [];

    echo json_encode(['success' => true, 'order_id' => $orderId, 'msg' => "অর্ডার #$orderId সফলভাবে দেওয়া হয়েছে!"]);
    exit;
}

// ── MY ORDERS ──
if ($action === 'my') {
    $userId = $_SESSION['user_id'] ?? null;
    if (!$userId) { echo json_encode(['success' => false, 'msg' => 'Login করুন।']); exit; }

    $stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    $orders = $stmt->fetchAll();
    echo json_encode(['success' => true, 'orders' => $orders]);
    exit;
}

// ── ALL ORDERS (admin) ──
if ($action === 'all') {
    $stmt = $db->prepare("SELECT * FROM orders ORDER BY created_at DESC");
    $stmt->execute();
    echo json_encode(['success'=>true,'orders'=>$stmt->fetchAll()]); exit;
}

// ── UPDATE STATUS ──
if ($action === 'updateStatus') {
    $orderId = (int)($input['order_id'] ?? 0);
    $status  = $input['status'] ?? 'pending';
    $db->prepare("UPDATE orders SET status=? WHERE order_id=?")->execute([$status,$orderId]);
    echo json_encode(['success'=>true]); exit;
}

echo json_encode(['success' => false, 'msg' => 'Invalid action']);
