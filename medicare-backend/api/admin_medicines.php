<?php
session_start();
require_once '../db.php';
cors();

// Admin check
if (empty($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success'=>false,'msg'=>'Admin access required']); exit;
}

$db = getDB();
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? [];

if ($action === 'add') {
    $db->prepare("INSERT INTO medicines (name,generic_name,company,drug_class,dosage_form,strength,price,stock,type,category_id,description,dosage,side_effects) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
      ->execute([$input['name'],$input['generic_name'],$input['company'],$input['drug_class'],$input['dosage_form'],$input['strength'],$input['price'],$input['stock'],$input['type'],$input['category_id'],$input['description'],$input['dosage'],$input['side_effects']]);
    echo json_encode(['success'=>true,'msg'=>'Medicine added!']); exit;
}

if ($action === 'update') {
    $db->prepare("UPDATE medicines SET name=?,generic_name=?,company=?,drug_class=?,dosage_form=?,strength=?,price=?,stock=?,type=?,category_id=?,description=?,dosage=?,side_effects=? WHERE medicine_id=?")
      ->execute([$input['name'],$input['generic_name'],$input['company'],$input['drug_class'],$input['dosage_form'],$input['strength'],$input['price'],$input['stock'],$input['type'],$input['category_id'],$input['description'],$input['dosage'],$input['side_effects'],$input['medicine_id']]);
    echo json_encode(['success'=>true,'msg'=>'Medicine updated!']); exit;
}

if ($action === 'delete') {
    $id = (int)($_GET['id'] ?? 0);
    $db->prepare("DELETE FROM medicines WHERE medicine_id=?")->execute([$id]);
    echo json_encode(['success'=>true,'msg'=>'Deleted!']); exit;
}
