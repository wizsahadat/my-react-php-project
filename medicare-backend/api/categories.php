<?php
require_once '../db.php';
cors();

$db = getDB();
$stmt = $db->prepare("SELECT c.*, COUNT(m.medicine_id) as medicine_count 
                       FROM categories c 
                       LEFT JOIN medicines m ON c.category_id = m.category_id 
                       GROUP BY c.category_id 
                       ORDER BY c.name ASC");
$stmt->execute();
$categories = $stmt->fetchAll();
echo json_encode(['success' => true, 'categories' => $categories]);
