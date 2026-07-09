<?php
session_start();
require_once '../db.php';

header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(0); }
header('Content-Type: application/json; charset=utf-8');

// Session check
if (empty($_SESSION['user_id']) || ($_SESSION['role'] ?? '') !== 'admin') {
    echo json_encode(['success' => false, 'msg' => 'Unauthorized']); exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'medicine_image') {
    $medicine_id = (int)($_POST['medicine_id'] ?? 0);
    if (!$medicine_id) {
        echo json_encode(['success' => false, 'msg' => 'Medicine ID দিন']); exit;
    }
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $errCode = $_FILES['image']['error'] ?? 'no file';
        echo json_encode(['success' => false, 'msg' => "ফাইল upload হয়নি (error: $errCode)"]); exit;
    }

    $file    = $_FILES['image'];
    $maxSize = 5 * 1024 * 1024;
    $allowed = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp','image/gif'=>'gif'];

    if ($file['size'] > $maxSize) {
        echo json_encode(['success' => false, 'msg' => 'ফাইল সাইজ ৫MB এর বেশি হতে পারবে না']); exit;
    }

    // Check MIME
    $finfo    = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!isset($allowed[$mimeType])) {
        echo json_encode(['success' => false, 'msg' => 'শুধু JPG, PNG, WEBP বা GIF আপলোড করা যাবে. আপনার ফাইল: '.$mimeType]); exit;
    }

    // Save to: C:\xampp\htdocs\medicare-backend\uploads\medicines\
    $uploadDir = realpath(__DIR__ . '/..') . '/uploads/medicines/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            echo json_encode(['success' => false, 'msg' => 'Upload folder তৈরি করা যায়নি: ' . $uploadDir]); exit;
        }
    }

    $ext      = $allowed[$mimeType];
    $filename = 'med_' . $medicine_id . '_' . time() . '.' . $ext;
    $savePath = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $savePath)) {
        echo json_encode(['success' => false, 'msg' => 'ফাইল সেভ করা যায়নি। Path: ' . $savePath]); exit;
    }

    // Public URL — accessible via Apache
    $imageUrl = 'http://localhost/medicare-backend/uploads/medicines/' . $filename;

    // Update DB
    $db = getDB();
    $db->prepare("UPDATE medicines SET image = ? WHERE medicine_id = ?")
       ->execute([$imageUrl, $medicine_id]);

    // Delete old files for this medicine (keep only latest)
    foreach (glob($uploadDir . 'med_' . $medicine_id . '_*') as $old) {
        if (basename($old) !== $filename) @unlink($old);
    }

    echo json_encode([
        'success'   => true,
        'msg'       => 'ছবি সফলভাবে আপলোড হয়েছে!',
        'image_url' => $imageUrl,
        'saved_to'  => $savePath,
    ]);
    exit;
}

echo json_encode(['success' => false, 'msg' => 'Invalid action']);
