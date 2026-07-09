<?php
require_once '../db.php';
cors();

$db = getDB();
$action = $_GET['action'] ?? 'list';

// ── LIST / SEARCH ──
if ($action === 'list') {
    $search   = trim($_GET['q'] ?? '');
    $category = (int)($_GET['category'] ?? 0);
    $type     = $_GET['type'] ?? '';
    $sort     = $_GET['sort'] ?? 'name';
    $page     = max(1, (int)($_GET['page'] ?? 1));
    $limit    = 12;
    $offset   = ($page - 1) * $limit;

    $where = ["1=1"];
    $params = [];

    if ($search) {
        $where[] = "(m.name LIKE ? OR m.generic_name LIKE ? OR m.company LIKE ?)";
        $like = "%$search%";
        $params = array_merge($params, [$like, $like, $like]);
    }
    if ($category) {
        $where[] = "m.category_id = ?";
        $params[] = $category;
    }
    if ($type === 'OTC' || $type === 'Prescription') {
        $where[] = "m.type = ?";
        $params[] = $type;
    }

    $orderBy = match($sort) {
        'price_asc'  => 'm.price ASC',
        'price_desc' => 'm.price DESC',
        default      => 'm.name ASC'
    };

    $whereStr = implode(' AND ', $where);

    // Count
    $countStmt = $db->prepare("SELECT COUNT(*) FROM medicines m WHERE $whereStr");
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();

    // Data
    $stmt = $db->prepare("SELECT m.*, c.name as category_name FROM medicines m 
                          LEFT JOIN categories c ON m.category_id = c.category_id
                          WHERE $whereStr ORDER BY $orderBy LIMIT $limit OFFSET $offset");
    $stmt->execute($params);
    $medicines = $stmt->fetchAll();

    // Fix image paths
    foreach ($medicines as &$med) {
        if ($med['image'] && !str_starts_with($med['image'], 'http')) {
            $med['image'] = 'http://localhost/wdpf_69/medicare_full/' . str_replace('\\', '/', $med['image']);
        }
    }

    echo json_encode([
        'success'    => true,
        'medicines'  => $medicines,
        'total'      => (int)$total,
        'page'       => $page,
        'totalPages' => ceil($total / $limit)
    ]);
    exit;
}

// ── SINGLE MEDICINE ──
if ($action === 'single') {
    $id = (int)($_GET['id'] ?? 0);
    $stmt = $db->prepare("SELECT m.*, c.name as category_name FROM medicines m 
                          LEFT JOIN categories c ON m.category_id = c.category_id
                          WHERE m.medicine_id = ?");
    $stmt->execute([$id]);
    $med = $stmt->fetch();
    if ($med) {
        if ($med['image'] && !str_starts_with($med['image'], 'http')) {
            $med['image'] = 'http://localhost/wdpf_69/medicare_full/' . str_replace('\\', '/', $med['image']);
        }
        echo json_encode(['success' => true, 'medicine' => $med]);
    } else {
        echo json_encode(['success' => false, 'msg' => 'Medicine not found']);
    }
    exit;
}

// ── FEATURED ──
if ($action === 'featured') {
    $stmt = $db->prepare("SELECT m.*, c.name as category_name FROM medicines m 
                          LEFT JOIN categories c ON m.category_id = c.category_id
                          WHERE m.is_featured = 1 LIMIT 8");
    $stmt->execute();
    $medicines = $stmt->fetchAll();
    foreach ($medicines as &$med) {
        if ($med['image'] && !str_starts_with($med['image'], 'http')) {
            $med['image'] = 'http://localhost/wdpf_69/medicare_full/' . str_replace('\\', '/', $med['image']);
        }
    }
    echo json_encode(['success' => true, 'medicines' => $medicines]);
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Invalid action']);
