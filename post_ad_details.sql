-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 14, 2023 at 11:35 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `buynzell`
--

-- --------------------------------------------------------

--
-- Table structure for table `post_ad_details`
--

CREATE TABLE `post_ad_details` (
  `post_ad_id` int(100) NOT NULL,
  `customer_id` int(250) NOT NULL,
  `listing_id` varchar(250) NOT NULL,
  `category` varchar(200) NOT NULL,
  `sub_category` varchar(250) NOT NULL,
  `ad_posted_date` varchar(200) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(200) NOT NULL,
  `year_of_registration` varchar(200) NOT NULL,
  `km_driven` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` varchar(200) NOT NULL,
  `no_of_owners` varchar(200) NOT NULL,
  `fuel_type` varchar(250) NOT NULL,
  `steering_option` varchar(250) NOT NULL,
  `horse_power` varchar(200) NOT NULL,
  `no_od_doors` varchar(200) NOT NULL,
  `no_of_cylinders` varchar(200) NOT NULL,
  `no_of_seats` varchar(200) NOT NULL,
  `insurence_validity_upto` varchar(250) NOT NULL,
  `exterior_color` varchar(200) NOT NULL,
  `interior_color` varchar(250) NOT NULL,
  `photos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`photos`)),
  `price` varchar(250) NOT NULL,
  `latitude` int(200) NOT NULL,
  `longitude` int(200) NOT NULL,
  `name` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `phone_number` varchar(200) NOT NULL,
  `show_contact_information` tinyint(1) NOT NULL,
  `plan_validity_days` int(100) NOT NULL,
  `is_select_featureIn_category` tinyint(1) NOT NULL,
  `is_select_feature_in_search_results` tinyint(1) NOT NULL,
  `active_membership_package` varchar(100) NOT NULL,
  `discount_coupon_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`discount_coupon_details`)),
  `total_amount` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `post_ad_details`
--
ALTER TABLE `post_ad_details`
  ADD PRIMARY KEY (`post_ad_id`),
  ADD UNIQUE KEY `post_ad_id` (`post_ad_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `post_ad_details`
--
ALTER TABLE `post_ad_details`
  MODIFY `post_ad_id` int(100) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
