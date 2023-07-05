-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2023 at 01:44 PM
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
-- Table structure for table `used_cars_brands_list`
--

CREATE TABLE `used_cars_brands_list` (
  `id` int(250) NOT NULL,
  `model` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `used_cars_brands_list`
--

INSERT INTO `used_cars_brands_list` (`id`, `model`) VALUES
(1, 'Abarth'),
(2, 'Acura'),
(3, 'Alfa Remo'),
(4, 'Ariel'),
(5, 'Aston Martain'),
(6, 'Audi'),
(7, 'BAC'),
(8, 'BAIC'),
(9, 'Bentley'),
(10, 'Bestune'),
(11, 'Bizzarrini'),
(12, 'BMW'),
(13, 'BMWAlphina'),
(14, 'Borgward'),
(15, 'Brilliance'),
(16, 'Bufori'),
(17, 'Bugatti'),
(18, 'Buick'),
(19, 'BYD'),
(20, 'Cadillac'),
(21, 'Can-am'),
(22, 'Caterham'),
(23, 'CEVO'),
(24, 'Changan'),
(25, 'Chery'),
(26, 'Chevrolet'),
(27, 'Chrysler'),
(28, 'Citroen'),
(29, 'CMC');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `used_cars_brands_list`
--
ALTER TABLE `used_cars_brands_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `used_cars_brands_list`
--
ALTER TABLE `used_cars_brands_list`
  MODIFY `id` int(250) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
