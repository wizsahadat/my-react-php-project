<?php
session_start();
require_once '../db.php';
cors();

$action = $_GET['action'] ?? '';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

// Session-based cart (login ছাড়াও কাজ করে)
if (!isset($_SESSION['cart'])) $_SESSION['cart'] = [];

// ── GET CART ──
if ($action === 'get') {
    echo json_encode(['success' => true, 'cart' => array_values($_SESSION['cart'])]);
    exit;
}

// ── ADD ──
if ($action === 'add') {
    $id  = (int)($input['medicine_id'] ?? 0);
    $qty = max(1, (int)($input['qty'] ?? 1));
    if (!$id) { echo json_encode(['success' => false, 'msg' => 'Invalid medicine']); exit; }

    $db   = getDB();
    $stmt = $db->prepare("SELECT medicine_id, name, price, image FROM medicines WHERE medicine_id = ?");
    $stmt->execute([$id]);
    $med = $stmt->fetch();
    if (!$med) { echo json_encode(['success' => false, 'msg' => 'Medicine not found']); exit; }

    if (isset($_SESSION['cart'][$id])) {
        $_SESSION['cart'][$id]['qty'] += $qty;
    } else {
        if ($med['image'] && !str_starts_with($med['image'], 'http')) {
            $med['image'] = 'http://localhost/wdpf_69/medicare_full/' . str_replace('\\', '/', $med['image']);
        }
        $_SESSION['cart'][$id] = ['medicine_id' => $id, 'name' => $med['name'], 'price' => (float)$med['price'], 'qty' => $qty, 'image' => $med['image']];
    }
    echo json_encode(['success' => true, 'cart' => array_values($_SESSION['cart'])]);
    exit;
}

// ── UPDATE QTY ──
if ($action === 'update') {
    $id  = (int)($input['medicine_id'] ?? 0);
    $qty = (int)($input['qty'] ?? 0);
    if ($qty <= 0) { unset($_SESSION['cart'][$id]); }
    else { if (isset($_SESSION['cart'][$id])) $_SESSION['cart'][$id]['qty'] = $qty; }
    echo json_encode(['success' => true, 'cart' => array_values($_SESSION['cart'])]);
    exit;
}

// ── REMOVE ──
if ($action === 'remove') {
    $id = (int)($input['medicine_id'] ?? 0);
    unset($_SESSION['cart'][$id]);
    echo json_encode(['success' => true, 'cart' => array_values($_SESSION['cart'])]);
    exit;
}

// ── CLEAR ──
if ($action === 'clear') {
    $_SESSION['cart'] = [];
    echo json_encode(['success' => true, 'cart' => []]);
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Invalid action']);
