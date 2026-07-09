<?php
session_start();
require_once '../db.php';
cors();

$db     = getDB();
$action = $_GET['action'] ?? '';
$input  = json_decode(file_get_contents('php://input'), true) ?? [];

// ── DASHBOARD STATS ──
if ($action === 'stats') {
    $stats = [];
    $stats['total_medicines'] = $db->query("SELECT COUNT(*) FROM medicines")->fetchColumn();
    $stats['total_orders']    = $db->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $stats['total_users']     = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $stats['total_revenue']   = $db->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status != 'cancelled'")->fetchColumn();
    $stats['pending_orders']  = $db->query("SELECT COUNT(*) FROM orders WHERE status='pending'")->fetchColumn();
    $stats['low_stock']       = $db->query("SELECT COUNT(*) FROM medicines WHERE stock < 10")->fetchColumn();
    $stmt = $db->query("SELECT o.*, u.name as user_name FROM orders o LEFT JOIN users u ON o.user_id = u.user_id ORDER BY o.created_at DESC LIMIT 5");
    $stats['recent_orders'] = $stmt->fetchAll();
    $stmt = $db->query("SELECT m.name, SUM(oi.qty) as sold FROM order_items oi JOIN medicines m ON oi.medicine_id = m.medicine_id GROUP BY oi.medicine_id ORDER BY sold DESC LIMIT 5");
    $stats['top_medicines'] = $stmt->fetchAll();
    echo json_encode(['success' => true, 'stats' => $stats]);
    exit;
}

// ── Helper: Resolve image URL ──
function resolveImageUrl(?string $img): string {
    if (!$img) return '';
    // Already a full URL
    if (str_starts_with($img, 'http')) return $img;
    // New upload path: uploads/medicines/xxx.jpg
    if (str_contains($img, 'uploads/medicines/')) {
        $filename = basename($img);
        return 'http://localhost/medicare-backend/uploads/medicines/' . $filename;
    }
    // Old PHP project relative path (wdpf_69)
    $clean = str_replace(['\\', '\\\\'], '/', $img);
    return 'http://localhost/wdpf_69/medicare_full/' . ltrim($clean, '/');
}

// ── MEDICINES LIST ──
if ($action === 'medicines') {
    $page   = max(1, (int)($_GET['page'] ?? 1));
    $limit  = 15;
    $offset = ($page - 1) * $limit;
    $search = trim($_GET['q'] ?? '');
    $where  = $search ? "WHERE m.name LIKE ? OR m.generic_name LIKE ?" : "";
    $params = $search ? ["%$search%", "%$search%"] : [];
    $total  = $db->prepare("SELECT COUNT(*) FROM medicines m $where");
    $total->execute($params);
    $total  = $total->fetchColumn();
    $stmt   = $db->prepare("SELECT m.*, c.name as category_name FROM medicines m LEFT JOIN categories c ON m.category_id = c.category_id $where ORDER BY m.medicine_id DESC LIMIT $limit OFFSET $offset");
    $stmt->execute($params);
    $medicines = $stmt->fetchAll();
    foreach ($medicines as &$med) {
        $med['image'] = resolveImageUrl($med['image'] ?? '');
    }
    echo json_encode(['success' => true, 'medicines' => $medicines, 'total' => (int)$total, 'totalPages' => ceil($total / $limit)]);
    exit;
}

// ── MEDICINE DETAIL (for edit) ──
if ($action === 'medicine_detail') {
    $id   = (int)($_GET['id'] ?? 0);
    $stmt = $db->prepare("SELECT m.*, c.name as category_name FROM medicines m LEFT JOIN categories c ON m.category_id = c.category_id WHERE m.medicine_id = ?");
    $stmt->execute([$id]);
    $med = $stmt->fetch();
    if ($med) {
        $med['image'] = resolveImageUrl($med['image'] ?? '');
    }
    // get all categories for dropdown
    $cats = $db->query("SELECT category_id, name FROM categories ORDER BY name")->fetchAll();
    echo json_encode(['success' => true, 'medicine' => $med, 'categories' => $cats]);
    exit;
}

// ── UPDATE MEDICINE (full fields) ──
if ($action === 'update_medicine') {
    $id          = (int)($input['medicine_id'] ?? 0);
    $name        = trim($input['name'] ?? '');
    $generic     = trim($input['generic_name'] ?? '');
    $company     = trim($input['company'] ?? '');
    $drug_class  = trim($input['drug_class'] ?? '');
    $price       = (float)($input['price'] ?? 0);
    $stock       = (int)($input['stock'] ?? 0);
    $type        = trim($input['type'] ?? 'OTC');
    $cat_id      = (int)($input['category_id'] ?? 0);
    $dosage_form = trim($input['dosage_form'] ?? '');
    $strength    = trim($input['strength'] ?? '');
    $desc        = trim($input['description'] ?? '');
    $indications = trim($input['indications'] ?? '');
    $dosage_txt  = trim($input['dosage'] ?? '');
    $side_eff    = trim($input['side_effects'] ?? '');
    $contra      = trim($input['contraindications'] ?? '');

    if (!$id) { echo json_encode(['success'=>false,'msg'=>'Medicine ID নেই']); exit; }

    // Ensure optional columns exist
    foreach ([
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS drug_class VARCHAR(150) DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS dosage_form VARCHAR(100) DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS strength VARCHAR(100) DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS indications TEXT DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS dosage TEXT DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS side_effects TEXT DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS contraindications TEXT DEFAULT NULL",
    ] as $sql) { try { $db->exec($sql); } catch (Exception $e) {} }

    try {
        $db->prepare("UPDATE medicines SET
            name=?,generic_name=?,company=?,drug_class=?,price=?,stock=?,
            type=?,category_id=?,dosage_form=?,strength=?,
            description=?,indications=?,dosage=?,side_effects=?,contraindications=?
            WHERE medicine_id=?")
           ->execute([
               $name,$generic,$company,$drug_class,$price,$stock,
               $type,$cat_id?:null,$dosage_form,$strength,
               $desc,$indications,$dosage_txt,$side_eff,$contra,$id
           ]);
        echo json_encode(['success'=>true,'msg'=>'Medicine আপডেট হয়েছে!']);
    } catch (Exception $e) {
        // Fallback: update only core fields
        try {
            $db->prepare("UPDATE medicines SET name=?,generic_name=?,company=?,price=?,stock=?,type=?,category_id=?,description=? WHERE medicine_id=?")
               ->execute([$name,$generic,$company,$price,$stock,$type,$cat_id?:null,$desc,$id]);
            echo json_encode(['success'=>true,'msg'=>'Medicine আপডেট হয়েছে!']);
        } catch (Exception $e2) {
            echo json_encode(['success'=>false,'msg'=>'DB Error: '.$e2->getMessage()]);
        }
    }
    exit;
}

// ── ADD MEDICINE ──
if ($action === 'add_medicine') {
    $name        = trim($input['name'] ?? '');
    $generic     = trim($input['generic_name'] ?? '');
    $company     = trim($input['company'] ?? '');
    $drug_class  = trim($input['drug_class'] ?? '');
    $price       = (float)($input['price'] ?? 0);
    $stock       = (int)($input['stock'] ?? 0);
    $type        = trim($input['type'] ?? 'OTC');
    $cat_id      = (int)($input['category_id'] ?? 0);
    $dosage_form = trim($input['dosage_form'] ?? '');
    $strength    = trim($input['strength'] ?? '');
    $desc        = trim($input['description'] ?? '');
    $indications = trim($input['indications'] ?? '');
    $dosage_txt  = trim($input['dosage'] ?? '');
    $side_eff    = trim($input['side_effects'] ?? '');
    $contra      = trim($input['contraindications'] ?? '');

    if (!$name || $price <= 0) {
        echo json_encode(['success'=>false,'msg'=>'Name ও Price আবশ্যক']); exit;
    }

    // Ensure optional columns exist
    foreach ([
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS drug_class VARCHAR(150) DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS dosage_form VARCHAR(100) DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS strength VARCHAR(100) DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS indications TEXT DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS dosage TEXT DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS side_effects TEXT DEFAULT NULL",
        "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS contraindications TEXT DEFAULT NULL",
    ] as $sql) { try { $db->exec($sql); } catch (Exception $e) {} }

    try {
        $db->prepare("INSERT INTO medicines
            (name,generic_name,company,drug_class,price,stock,type,category_id,
             dosage_form,strength,description,indications,dosage,side_effects,contraindications)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
           ->execute([
               $name,$generic,$company,$drug_class,$price,$stock,
               $type,$cat_id?:null,$dosage_form,$strength,
               $desc,$indications,$dosage_txt,$side_eff,$contra
           ]);
        $newId = (int)$db->lastInsertId();
        echo json_encode(['success'=>true,'msg'=>'Medicine যোগ হয়েছে!','id'=>$newId]);
    } catch (Exception $e) {
        // Fallback: minimal insert
        try {
            $db->prepare("INSERT INTO medicines (name,generic_name,company,price,stock,type,category_id,description)
                          VALUES (?,?,?,?,?,?,?,?)")
               ->execute([$name,$generic,$company,$price,$stock,$type,$cat_id?:null,$desc]);
            $newId = (int)$db->lastInsertId();
            echo json_encode(['success'=>true,'msg'=>'Medicine যোগ হয়েছে!','id'=>$newId]);
        } catch (Exception $e2) {
            echo json_encode(['success'=>false,'msg'=>'DB Error: '.$e2->getMessage()]);
        }
    }
    exit;
}

// ── DELETE MEDICINE ──
if ($action === 'delete_medicine') {
    $id = (int)($input['medicine_id'] ?? 0);
    $db->prepare("DELETE FROM medicines WHERE medicine_id=?")->execute([$id]);
    echo json_encode(['success' => true, 'msg' => 'Deleted!']);
    exit;
}

// ── INVENTORY (real data from medicines) ──
if ($action === 'inventory') {
    $search = trim($_GET['q'] ?? '');
    $filter = $_GET['filter'] ?? 'all'; // all | low | out
    $where  = "WHERE 1=1";
    $params = [];
    if ($search) { $where .= " AND (m.name LIKE ? OR m.generic_name LIKE ?)"; $params[] = "%$search%"; $params[] = "%$search%"; }
    if ($filter === 'low') { $where .= " AND m.stock > 0 AND m.stock < 15"; }
    if ($filter === 'out') { $where .= " AND m.stock = 0"; }
    $stmt = $db->prepare("SELECT m.medicine_id, m.name, m.generic_name, m.company, m.stock, m.price, m.type, c.name as category_name
                          FROM medicines m LEFT JOIN categories c ON m.category_id = c.category_id
                          $where ORDER BY m.stock ASC, m.name ASC");
    $stmt->execute($params);
    $items = $stmt->fetchAll();
    $total_value = $db->query("SELECT COALESCE(SUM(stock*price),0) FROM medicines")->fetchColumn();
    $out_count   = $db->query("SELECT COUNT(*) FROM medicines WHERE stock=0")->fetchColumn();
    $low_count   = $db->query("SELECT COUNT(*) FROM medicines WHERE stock>0 AND stock<15")->fetchColumn();
    $total_count = $db->query("SELECT COUNT(*) FROM medicines")->fetchColumn();
    echo json_encode(['success'=>true,'items'=>$items,'total_value'=>(float)$total_value,
                      'out_count'=>(int)$out_count,'low_count'=>(int)$low_count,'total_count'=>(int)$total_count]);
    exit;
}

// ── CATEGORIES (for dropdowns) ──
if ($action === 'categories') {
    $cats = $db->query("SELECT category_id, name FROM categories ORDER BY name")->fetchAll();
    echo json_encode(['success'=>true,'categories'=>$cats]);
    exit;
}

// ── ORDERS LIST ──
if ($action === 'orders') {
    $page   = max(1, (int)($_GET['page'] ?? 1));
    $limit  = 15;
    $offset = ($page - 1) * $limit;
    $status = $_GET['status'] ?? '';
    $where  = $status ? "WHERE o.status = ?" : "";
    $params = $status ? [$status] : [];
    $total  = $db->prepare("SELECT COUNT(*) FROM orders o $where");
    $total->execute($params);
    $total  = $total->fetchColumn();
    $stmt   = $db->prepare("SELECT o.*, u.name as user_name, u.email as user_email FROM orders o LEFT JOIN users u ON o.user_id = u.user_id $where ORDER BY o.created_at DESC LIMIT $limit OFFSET $offset");
    $stmt->execute($params);
    $orders = $stmt->fetchAll();
    echo json_encode(['success' => true, 'orders' => $orders, 'total' => (int)$total, 'totalPages' => ceil($total / $limit)]);
    exit;
}

// ── ORDER DETAIL ──
if ($action === 'order_detail') {
    $id   = (int)($_GET['id'] ?? 0);
    $stmt = $db->prepare("SELECT * FROM orders WHERE order_id=?");
    $stmt->execute([$id]);
    $order = $stmt->fetch();
    $items = $db->prepare("SELECT * FROM order_items WHERE order_id=?");
    $items->execute([$id]);
    $order['items'] = $items->fetchAll();
    echo json_encode(['success' => true, 'order' => $order]);
    exit;
}

// ── UPDATE ORDER STATUS ──
if ($action === 'update_order') {
    $id     = (int)($input['order_id'] ?? 0);
    $status = $input['status'] ?? '';
    $db->prepare("UPDATE orders SET status=? WHERE order_id=?")->execute([$status, $id]);
    echo json_encode(['success' => true, 'msg' => 'Status updated!']);
    exit;
}

// ── USERS LIST ──
if ($action === 'users') {
    $page   = max(1, (int)($_GET['page'] ?? 1));
    $limit  = 15;
    $offset = ($page - 1) * $limit;
    $search = trim($_GET['q'] ?? '');
    $where  = $search ? "WHERE name LIKE ? OR email LIKE ?" : "";
    $params = $search ? ["%$search%", "%$search%"] : [];
    $total  = $db->prepare("SELECT COUNT(*) FROM users $where");
    $total->execute($params);
    $total  = $total->fetchColumn();
    $stmt   = $db->prepare("SELECT user_id, name, email, phone, role, created_at FROM users $where ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
    $stmt->execute($params);
    $users  = $stmt->fetchAll();
    echo json_encode(['success' => true, 'users' => $users, 'total' => (int)$total, 'totalPages' => ceil($total / $limit)]);
    exit;
}

// ── DELETE USER ──
if ($action === 'delete_user') {
    $id = (int)($input['user_id'] ?? 0);
    $db->prepare("DELETE FROM users WHERE user_id=? AND role != 'admin'")->execute([$id]);
    echo json_encode(['success' => true, 'msg' => 'User deleted!']);
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Invalid action']);
