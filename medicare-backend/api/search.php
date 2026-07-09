<?php
require_once '../db.php';
cors();

$q = trim($_GET['q'] ?? '');
if (strlen($q) < 2) { echo json_encode([]); exit; }

$db   = getDB();
$stmt = $db->prepare("SELECT medicine_id, name, price, type, image, generic_name, company 
                       FROM medicines WHERE name LIKE ? OR generic_name LIKE ? LIMIT 8");
$like = "%$q%";
$stmt->execute([$like, $like]);
$results = $stmt->fetchAll();

foreach ($results as &$med) {
    if ($med['image'] && !str_starts_with($med['image'], 'http')) {
        $med['image'] = 'http://localhost/wdpf_69/medicare_full/' . str_replace('\\', '/', $med['image']);
    }
}

echo json_encode($results);
