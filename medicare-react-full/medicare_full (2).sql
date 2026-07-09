-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2026 at 09:11 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medicare_full`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `icon` varchar(60) DEFAULT 'fa-pills',
  `description` text DEFAULT NULL,
  `medicine_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `icon`, `description`, `medicine_count`) VALUES
(1, 'Cardiology', 'fa-heartbeat', 'Heart and cardiovascular medicines', 142),
(2, 'Allergy', 'fa-allergies', 'Allergy treatment medicines', 87),
(3, 'Neurology', 'fa-brain', 'Neurological disorder medicines', 63),
(4, 'Antibiotics', 'fa-capsules', 'Various antibiotic medicines', 210),
(5, 'Vitamins', 'fa-apple-alt', 'Vitamins and supplements', 95),
(6, 'Respiratory', 'fa-lungs', 'Respiratory tract medicines', 74),
(7, 'Orthopedic', 'fa-bone', 'Bone and joint medicines', 58),
(8, 'Eye Care', 'fa-eye', 'Eye care medicines', 42),
(9, 'Paracetamol', 'fa-capsules', NULL, 0),
(10, 'Gastroenterologist', 'fa-capsules', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `delivery_men`
--

CREATE TABLE `delivery_men` (
  `delivery_man_id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `vehicle` varchar(60) DEFAULT NULL,
  `area` varchar(150) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery_men`
--

INSERT INTO `delivery_men` (`delivery_man_id`, `name`, `phone`, `email`, `vehicle`, `area`, `status`, `created_at`) VALUES
(1, 'sahadat', '01331227670', 'cogentsahadat68@gmail.com', 'bike', 'narayanjong', 'active', '2026-06-20 15:18:25');

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `medicine_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `company_name` varchar(100) DEFAULT NULL,
  `generic_name` varchar(150) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `drug_class` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `indications` text DEFAULT NULL,
  `dosage` text DEFAULT NULL,
  `side_effects` text DEFAULT NULL,
  `contraindications` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `type` enum('OTC','Prescription') DEFAULT 'OTC',
  `dosage_form` varchar(60) DEFAULT NULL,
  `strength` varchar(60) DEFAULT NULL,
  `image` varchar(255) DEFAULT 'assets/images/default.png',
  `is_featured` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`medicine_id`, `category_id`, `name`, `company_name`, `generic_name`, `company`, `drug_class`, `description`, `indications`, `dosage`, `side_effects`, `contraindications`, `price`, `stock`, `type`, `dosage_form`, `strength`, `image`, `is_featured`, `created_at`) VALUES
(6, 2, 'Cetirizine 10mg', NULL, 'Cetirizine HCl', 'Renata Limited', 'Antihistamine (2nd gen)', 'Non-drowsy allergy relief.', 'Allergic rhinitis, urticaria, hives.', 'Adults: 10mg once daily.', 'Mild drowsiness, dry mouth, headache.', 'Severe renal impairment.', 50.00, 120, 'OTC', 'Tablet', '10mg', 'assets/images/med_1773243802_464.jpg', 1, '2026-03-10 17:07:52'),
(11, 1, 'ecosprin', NULL, 'asprin', 'acmi', '', '', '', '', '', '', 80.00, 12, 'Prescription', 'tab', '75', 'assets/images/med_1773213214_912.jpg', 0, '2026-03-11 07:13:34'),
(12, 4, 'zimax', NULL, 'azithomycin', 'square', 'Antihistamine (2nd gen)', '', '', '', '', '', 1200.00, 44, 'Prescription', 'Tablet', '500mg,250mg', 'assets/images/med_1773499684_464.jpg', 0, '2026-03-14 14:48:04'),
(15, 9, 'Napa one', NULL, 'paracetamol', 'Beximco Pharma', '', '', '', '', '', '', 150.00, 55, 'OTC', 'Tablet', '500mg', 'assets/images/med_1774005200_843.jpg', 0, '2026-03-20 11:13:20'),
(16, 9, 'Napa Extend ', NULL, 'paracetamol', 'Beximco Pharma', '', '', '', '', '', '', 560.00, 22, 'OTC', 'Tablet', '665mg', 'assets/images/med_1774005362_176.jpg', 0, '2026-03-20 11:16:02'),
(17, 9, 'Napa Extra', NULL, 'paracetamol', 'Beximco Pharma', '', '', '', '', '', '', 880.00, 66, 'OTC', 'Tablet', '500mg', 'assets/images/med_1774005533_629.jpg', 0, '2026-03-20 11:17:48'),
(18, 9, 'Napa', NULL, 'paracetamol', 'Beximco Pharma', '', '', '', '', '', '', 120.00, 28, 'OTC', 'Tablet', '500mg', 'assets/images/med_1776189664_174.jpg', 1, '2026-03-20 16:03:49'),
(19, 1, 'Atova', NULL, 'atovastatin', 'Beximco Pharma', '', '', '', '', '', '', 360.00, 44, 'Prescription', 'Tablet', '10mg', 'assets/images/med_1774233179_575.jpg', 0, '2026-03-23 02:32:59'),
(20, 1, 'Bazoran5/20', NULL, 'Amlodipine + Olmesartan Medoxomil', 'Beximco Pharma', '', '', '', '', '', '', 360.00, 12, 'Prescription', 'Tablet', '5/20', 'assets/images/med_1774233935_283.jpg', 0, '2026-03-23 02:45:35'),
(21, 1, 'Abecab', NULL, 'Amlodipine + Olmesartan Medoxomil', 'ACI Limited', '', '', '', '', '', '', 600.00, 13, 'Prescription', 'Tablet', '5/20', 'assets/images/med_1774234240_481.jpg', 0, '2026-03-23 02:50:40'),
(22, 1, 'Bislol', NULL, 'Bisoprolol Fumarate', 'Opsonin Pharma Ltd.', '', '', '', '', '', '', 98.00, 18, 'OTC', 'Tablet', '2.5mg', 'assets/images/med_1774234555_952.jpg', 0, '2026-03-23 02:55:55'),
(23, 2, 'Fexo', NULL, 'Fexofenadine Hydrochloride', 'Square Pharmaceuticals PLC.', 'Antihistamine (2nd gen)', '', '', '', '', '', 81.00, 9, 'OTC', 'Tablet', '120mg', 'assets/images/med_1776186361_856.jpg', 1, '2026-04-14 17:06:01'),
(24, 2, 'Alatrol', NULL, 'Cetirizine Hydrochloride ', 'Square Pharmaceuticals PLC.', 'Antihistamine (2nd gen)', '', '', '', '', '', 30.00, 55, 'OTC', 'Tablet', '10mg', 'assets/images/med_1776186488_800.jpg', 0, '2026-04-14 17:08:08'),
(25, 2, 'Biltin', NULL, 'Bilastine', 'Eskayef Bangladesh Ltd.', 'Analgesic / Antipyretic', '', '', '', '', '', 140.00, 44, 'OTC', 'Tablet', '20mg', 'assets/images/med_1776186612_869.jpg', 1, '2026-04-14 17:10:12'),
(27, 10, 'Sergel', NULL, 'Esomeprazole Magnesium Trihydrate', 'Healthcare Pharmaceuticals Ltd.', 'Antihistamine (2nd gen)', '', '', '', '', '', 65.00, 12, 'OTC', 'Tablet', '20mg', 'assets/images/med_1776187407_143.jpg', 1, '2026-04-14 17:23:27'),
(28, 10, 'Seclo', NULL, 'Omeprazole', 'Square Pharmaceuticals PLC.', 'Analgesic / Antipyretic', '', '', '', '', '', 55.00, 15, 'OTC', 'Capsule', '20mg', 'assets/images/med_1776187561_250.jpg', 1, '2026-04-14 17:25:34'),
(29, 3, 'Valex', NULL, 'Sodium Valproate', 'Incepta Pharmaceuticals Ltd.', 'Antihistamine (2nd gen)', '', '', '', '', '', 40.00, 65, 'OTC', 'Tablet', '200mg', 'assets/images/med_1776187691_337.jpg', 1, '2026-04-14 17:28:11'),
(30, 3, ' Neurolep', NULL, 'Piracetam', 'Square Pharmaceuticals PLC.', 'Analgesic / Antipyretic', '', '', '', '', '', 60.00, 8, 'OTC', 'Tablet', '800mg', 'assets/images/med_1776187805_807.jpg', 1, '2026-04-14 17:30:05'),
(31, 4, 'Cefaclav', NULL, 'Cefuroxime Axetil + Clavulanic Acid', 'Incepta Pharmaceuticals Ltd.', 'Antibiotic', '', '', '', '', '', 55.00, 65, 'Prescription', 'Tablet', '500mg', 'assets/images/med_1776188056_651.jpg', 1, '2026-04-14 17:34:16'),
(32, 4, ' Moxibac', NULL, 'Moxifloxacin Hydrochloride', 'Popular Pharmaceuticals Ltd.', 'Antibiotic', '', '', '', '', '', 65.00, 21, 'Prescription', 'Tablet', '400mg', 'assets/images/med_1776188163_771.jpg', 1, '2026-04-14 17:36:03'),
(33, 5, 'Atoz Senior', NULL, 'Multivitamin + Multimineral A-Z silver preparation', 'Radiant Pharmaceuticals Ltd.', 'Multivitamin', '', '', '', '', '', 120.00, 4, 'OTC', 'Tablet', 'A-Z', 'assets/images/med_1776188339_284.jpg', 1, '2026-04-14 17:38:59'),
(34, 5, ' Zovia Gold', NULL, 'Multivitamin + Multimineral A-Z gold preparation', 'Opsonin Pharma Ltd.', 'Multivitamin', '', '', '', '', '', 300.00, 44, 'OTC', 'Tablet', 'A-Z', 'assets/images/med_1776188471_187.jpg', 1, '2026-04-14 17:41:11'),
(35, 6, 'Fylox', NULL, 'Doxophylline', 'Radiant Pharmaceuticals Ltd.', 'Respiratory', '', '', '', '', '', 80.00, 12, 'Prescription', 'Tablet', '200mg', 'assets/images/med_1776188644_467.jpg', 1, '2026-04-14 17:44:04'),
(36, 6, 'Flindof', NULL, 'Doxophylline', 'Square Pharmaceuticals PLC.', 'Respiratory', '', '', '', '', '', 75.00, 54, 'Prescription', 'Tablet', '200mg', 'assets/images/med_1776188730_877.jpg', 1, '2026-04-14 17:45:30'),
(37, 6, 'Monas 10', NULL, 'Montelukast', 'ACME Laboratories Ltd.', 'Respiratory', '', '', '', '', '', 240.00, 22, 'OTC', 'Tablet', '10mg', 'assets/images/med_1776188835_939.jpg', 1, '2026-04-14 17:47:15'),
(38, 8, 'Optimox', NULL, 'Moxifloxacin Hydrochloride', 'Aristopharma Ltd.', 'Antibiotic', '', '', '', '', '', 200.01, 19, 'Prescription', 'Eye Drop', '0.5%', 'assets/images/med_1776189047_923.jpg', 1, '2026-04-14 17:50:47'),
(39, 8, 'Aquafresh', NULL, 'Carboxymethyl Cellulose', 'Popular Pharmaceuticals Ltd.', 'Antibiotic', '', '', '', '', '', 300.00, 9, 'Prescription', 'Eye Drop', '10 ml', 'assets/images/med_1776189177_663.jpg', 1, '2026-04-14 17:52:57'),
(40, 7, 'Ostocal D', NULL, 'Calcium Carbonate [Elemental] + Vitamin D3', 'Eskayef Bangladesh Ltd.', 'Calcium Carbonate', '', '', '', '', '', 240.00, 16, 'OTC', 'Tablet', '', 'assets/images/med_1776189315_870.jpg', 1, '2026-04-14 17:55:15'),
(41, NULL, 'Calboral-D', NULL, 'calcium carbonate', 'squre', '', '', '', '', '', '', 300.00, 18, 'OTC', '', '', 'assets/images/med_1776189424_512.jpg', 1, '2026-04-14 17:57:04');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `order_id`, `message`, `is_read`, `created_at`) VALUES
(1, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 04:31:14'),
(2, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 04:31:38'),
(3, 1, 5, 'আপনার অর্ডার #5 এখন Pending অবস্থায় আছে।', 0, '2026-04-30 04:31:54'),
(4, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 04:32:35'),
(5, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 04:33:07'),
(6, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 04:34:07'),
(7, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 04:35:13'),
(8, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 04:43:23'),
(9, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 04:44:39'),
(10, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 05:00:39'),
(11, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 05:06:00'),
(12, 3, 6, 'আপনার অর্ডার #6 এখন Delivered অবস্থায় আছে।', 0, '2026-04-30 05:06:15'),
(13, 4, 10, 'আপনার অর্ডার #10 এখন Pending অবস্থায় আছে।', 0, '2026-04-30 07:18:55');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `delivery_address` text NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `payment_method` varchar(20) DEFAULT 'cod',
  `payment_note` varchar(255) DEFAULT '',
  `notes` text DEFAULT NULL,
  `payment` varchar(20) DEFAULT 'cod',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `delivery_man_id` int(11) DEFAULT NULL,
  `is_seen` tinyint(1) DEFAULT 0,
  `name` varchar(100) NOT NULL DEFAULT '',
  `address` text DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_status` enum('not_assigned','assigned','picked_up','on_the_way','delivered','failed') NOT NULL DEFAULT 'not_assigned',
  `delivered_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `status`, `delivery_address`, `phone`, `payment_method`, `payment_note`, `notes`, `payment`, `created_at`, `delivery_man_id`, `is_seen`, `name`, `address`, `total`, `delivery_status`, `delivered_at`) VALUES
(1, 1, 201.00, 'pending', 'narayangong', '01826236725376', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-27 03:27:17', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(2, 1, 365.00, 'pending', 'akdjal', '565675757', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-29 04:34:21', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(3, 1, 300.00, 'pending', 'dhaka', '33509509', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-29 04:44:48', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(4, 1, 300.00, 'pending', 'fgfg', '33509509', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-29 04:47:27', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(5, 1, 75.00, 'pending', 'dfdf', '33509509', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-29 05:01:00', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(6, 3, 40.00, 'delivered', 'noakhali', '01331227670', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-29 05:05:30', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(7, 1, 300.00, 'pending', 'sahadat', '1223343434', 'bkash', 'bKash: 01825505973 | TXN: 12233', NULL, 'cod', '2026-04-30 06:04:30', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(8, 1, 360.00, 'pending', 'gfdgfdg', '1223343434', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-30 06:14:34', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(9, 4, 81.00, 'pending', 'dfgfgf', 'ytytyttyt', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-30 06:18:37', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(10, 4, 60.00, 'pending', 'cvbbvb', '24343454354', 'cod', 'Cash on Delivery', NULL, 'cod', '2026-04-30 06:47:16', NULL, 0, '', NULL, 0.00, 'not_assigned', NULL),
(11, 6, 0.00, 'pending', '', '01827505973', 'cod', '', 'fhdfk', 'cod', '2026-06-13 06:51:05', NULL, 0, 'rony', 'hfjkdhfjkdhfjk', 120.00, 'not_assigned', NULL),
(12, 6, 0.00, 'pending', '', '01827505758', 'cod', '', 'nvnkjd', 'cod', '2026-06-13 06:52:07', NULL, 0, 'rony', 'dkdshk', 81.00, 'not_assigned', NULL),
(13, 6, 0.00, 'pending', '', '01827505973', 'cod', '', 'cvcvcv', 'cod', '2026-06-13 06:54:26', NULL, 0, 'rony', 'cvbbvc', 81.00, 'not_assigned', NULL),
(14, 6, 0.00, 'pending', '', '01827505973', 'cod', '', 'djklfkl', 'cod', '2026-06-13 07:00:58', NULL, 0, 'rony', 'cm,vnvn', 261.00, 'not_assigned', NULL),
(15, 6, 0.00, 'delivered', '', '01884787848', 'bkash', '', 'cvvcv', 'cod', '2026-06-13 07:01:22', 1, 0, 'rony', 'vgffbvf', 120.00, 'delivered', '2026-06-20 15:18:53'),
(16, 1, 0.00, 'shipped', '', '01331227670', 'cod', '', 'gfgfg', 'cod', '2026-06-20 15:20:21', NULL, 0, 'rony', 'fgfgfg', 120.00, 'picked_up', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `item_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `medicine_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `name` varchar(150) NOT NULL DEFAULT '',
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `qty` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`item_id`, `order_id`, `medicine_id`, `quantity`, `unit_price`, `name`, `price`, `qty`) VALUES
(1, 1, 18, 1, 120.00, '', 0.00, 1),
(2, 1, 23, 1, 81.00, '', 0.00, 1),
(3, 2, 32, 1, 65.00, '', 0.00, 1),
(4, 2, 41, 1, 300.00, '', 0.00, 1),
(5, 3, 41, 1, 300.00, '', 0.00, 1),
(6, 4, 41, 1, 300.00, '', 0.00, 1),
(7, 5, 36, 1, 75.00, '', 0.00, 1),
(8, 6, 29, 1, 40.00, '', 0.00, 1),
(9, 7, 39, 1, 300.00, '', 0.00, 1),
(10, 8, 18, 3, 120.00, '', 0.00, 1),
(11, 9, 23, 1, 81.00, '', 0.00, 1),
(12, 10, 30, 1, 60.00, '', 0.00, 1),
(13, 11, 18, 0, 0.00, 'Napa', 120.00, 1),
(14, 12, 23, 0, 0.00, 'Fexo', 81.00, 1),
(15, 13, 23, 0, 0.00, 'Fexo', 81.00, 1),
(16, 14, 23, 0, 0.00, 'Fexo', 81.00, 1),
(17, 14, 25, 0, 0.00, 'Biltin', 140.00, 1),
(18, 14, 29, 0, 0.00, 'Valex', 40.00, 1),
(19, 15, 18, 0, 0.00, 'Napa', 120.00, 1),
(20, 16, 18, 0, 0.00, 'Napa', 120.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `patient_name` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `location` text DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `status` enum('pending','reviewed','approved','rejected') DEFAULT 'pending',
  `admin_note` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `user_id`, `patient_name`, `phone`, `location`, `lat`, `lng`, `duration`, `notes`, `image_url`, `status`, `admin_note`, `created_at`, `updated_at`) VALUES
(1, 6, 'rony', '01827606988', 'dhaka', NULL, NULL, '7 দিন', 'gfgfgf', 'http://localhost/medicare-backend/uploads/prescriptions/rx_1781534383_8820.png', 'reviewed', '', '2026-06-15 20:39:43', '2026-06-15 20:41:17'),
(2, 6, 'rony', '01331227670', 'dhaka', NULL, NULL, '10 দিন', 'fjkdfjdkfjdk', 'http://localhost/medicare-backend/uploads/prescriptions/rx_1781590069_4694.png', 'pending', NULL, '2026-06-16 12:07:49', '2026-06-16 12:07:49'),
(3, 6, 'rony', '01827505973', 'fhkjghkjf', NULL, NULL, '10 দিন', 'fgfgfg', 'http://localhost/medicare-backend/uploads/prescriptions/rx_1781926395_5994.png', 'pending', NULL, '2026-06-20 09:33:15', '2026-06-20 09:33:15'),
(4, 6, 'rony', '01866666666', 'dhaka', NULL, NULL, '30 দিন', 'fghhghg', 'http://localhost/medicare-backend/uploads/prescriptions/rx_1781938753_8419.jpg', 'rejected', '', '2026-06-20 14:59:13', '2026-06-20 14:59:39'),
(5, 1, 'rony', '01827505973', 'dfdf', NULL, NULL, '15 দিন', 'dff', 'http://localhost/medicare-backend/uploads/prescriptions/rx_1781968509_7714.jpg', 'pending', NULL, '2026-06-20 23:15:09', '2026-06-20 23:15:09'),
(6, 1, 'Admin', '01827505973', '56565', NULL, NULL, '7 দিন', 'dgfdg', 'http://localhost/medicare-backend/uploads/prescriptions/rx_1782195636_7565.webp', 'pending', NULL, '2026-06-23 14:20:36', '2026-06-23 14:20:36');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `address`, `role`, `created_at`) VALUES
(1, 'Admin', 'wizsahadat@gmail.com', '55af58cc71d48a45995f22b52e07b35d', '01827505973', NULL, 'admin', '2026-03-10 17:07:51'),
(3, 'rizon', 'rizon666@gmail.com', '$2y$10$QWPQDYZmf1IBIwR9RmIaweioq1yOgSZ8xIgpio0LotvrmpR5vW2by', '01331227670', NULL, 'user', '2026-04-29 05:04:24'),
(4, 'ovi', 'ovihossain@gmail.com', '$2y$10$9.BGAbkAxferfYu9h9S2j.Od46.FJI/b359KJvDRks8YxyRiiPVjq', '01331227670', NULL, 'user', '2026-04-30 03:18:00'),
(6, 'rony', 'ronyhossain@gmail.com', '$2y$10$j1jc8AYBOHhlzIboVA3E9erSGQotF9FfeITLVIF9eZkMXFaUDxCU6', '018235848', NULL, 'user', '2026-06-13 06:01:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `delivery_men`
--
ALTER TABLE `delivery_men`
  ADD PRIMARY KEY (`delivery_man_id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`medicine_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_name` (`name`),
  ADD KEY `idx_generic` (`generic_name`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_featured` (`is_featured`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `medicine_id` (`medicine_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `delivery_men`
--
ALTER TABLE `delivery_men`
  MODIFY `delivery_man_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `medicine_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `medicines`
--
ALTER TABLE `medicines`
  ADD CONSTRAINT `medicines_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`medicine_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
