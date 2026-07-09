=====================================================
   MediCare React — PHP Backend
   React-এর জন্য সম্পূর্ণ PHP API Backend
=====================================================

📁 FOLDER STRUCTURE:
   medicare-backend/
   ├── db.php              ← Database connection
   ├── README.txt          ← এই file
   └── api/
       ├── auth.php        ← Login, Register, Logout
       ├── medicines.php   ← Medicine list, search, detail
       ├── categories.php  ← Category list
       ├── cart.php        ← Cart (session-based)
       ├── orders.php      ← Order place, my orders
       └── search.php      ← Live search

📦 INSTALL করুন:
   1. এই "medicare-backend" folder টা:
      C:\xampp\htdocs\medicare-backend\
      এ রাখুন

   2. XAMPP → Apache + MySQL চালু করুন

   3. আপনার আগের "medicare_full" database 
      আগে থেকেই আছে — নতুন কিছু লাগবে না।
      (orders table না থাকলে নিচের SQL run করুন)

📊 ORDERS TABLE (phpMyAdmin-এ run করুন):
   CREATE TABLE IF NOT EXISTS `orders` (
     `order_id` int(11) NOT NULL AUTO_INCREMENT,
     `user_id` int(11) DEFAULT NULL,
     `name` varchar(100) NOT NULL,
     `phone` varchar(20) NOT NULL,
     `address` text NOT NULL,
     `total` decimal(10,2) NOT NULL,
     `status` varchar(30) DEFAULT 'pending',
     `created_at` timestamp DEFAULT current_timestamp(),
     PRIMARY KEY (`order_id`)
   ) ENGINE=InnoDB;

   CREATE TABLE IF NOT EXISTS `order_items` (
     `item_id` int(11) NOT NULL AUTO_INCREMENT,
     `order_id` int(11) NOT NULL,
     `medicine_id` int(11) DEFAULT NULL,
     `name` varchar(150) NOT NULL,
     `price` decimal(10,2) NOT NULL,
     `qty` int(11) NOT NULL,
     PRIMARY KEY (`item_id`)
   ) ENGINE=InnoDB;

🔗 API ENDPOINTS:
   http://localhost/medicare-backend/api/auth.php?action=login     (POST)
   http://localhost/medicare-backend/api/auth.php?action=register  (POST)
   http://localhost/medicare-backend/api/auth.php?action=logout    (GET)
   http://localhost/medicare-backend/api/auth.php?action=check     (GET)
   http://localhost/medicare-backend/api/medicines.php?action=list (GET)
   http://localhost/medicare-backend/api/medicines.php?action=featured (GET)
   http://localhost/medicare-backend/api/medicines.php?action=single&id=1 (GET)
   http://localhost/medicare-backend/api/categories.php            (GET)
   http://localhost/medicare-backend/api/search.php?q=napa         (GET)
   http://localhost/medicare-backend/api/cart.php?action=add       (POST)
   http://localhost/medicare-backend/api/orders.php?action=place   (POST)

✅ TEST করুন:
   Browser-এ যান:
   http://localhost/medicare-backend/api/categories.php
   JSON response দেখালে সব ঠিক আছে!
