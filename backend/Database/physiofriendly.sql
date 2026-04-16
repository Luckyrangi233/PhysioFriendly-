-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 at 04:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `physiofriendly`
--

-- --------------------------------------------------------

--
-- Table structure for table `cases`
--

CREATE TABLE `cases` (
  `case_id` int(11) NOT NULL,
  `patient_name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `injury_name` varchar(100) NOT NULL,
  `injury_details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `mobile` varchar(15) DEFAULT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cases`
--

INSERT INTO `cases` (`case_id`, `patient_name`, `age`, `gender`, `injury_name`, `injury_details`, `created_at`, `mobile`, `address`) VALUES
(1, 'Gaurav Yadav', 21, 'Male', 'Shoulder Injury', 'Labral Tear', '2026-03-15 13:51:03', NULL, NULL),
(2, 'Roshan Yadav', 22, 'Male', 'Leg Injury', 'Lateral Ankle Sprain', '2026-03-15 13:56:12', NULL, NULL),
(3, 'Prashant Singh Sisodia', 22, 'Male', 'Shoulder Injury', 'ACL Tear', '2026-03-15 14:08:08', NULL, NULL),
(4, 'Nitesh Sharma', 23, 'Male', 'Shouder injury', 'Rotator Cuff Tendonitis', '2026-03-22 17:49:20', '9090909090', 'Dadi ka Phatak, Jaipur');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL,
  `case_id` int(11) NOT NULL,
  `session_number` int(11) NOT NULL,
  `session_date` date NOT NULL,
  `exercises` text DEFAULT NULL,
  `therapy` text DEFAULT NULL,
  `medication` text DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `duration_minutes` int(11) DEFAULT NULL,
  `pain` int(11) DEFAULT NULL,
  `mobility` int(11) DEFAULT NULL,
  `strength` int(11) DEFAULT NULL,
  `motor_control` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `case_id`, `session_number`, `session_date`, `exercises`, `therapy`, `medication`, `remarks`, `duration_minutes`, `pain`, `mobility`, `strength`, `motor_control`) VALUES
(1, 1, 1, '2026-03-15', 'Pendulum swings, Internal rotation stretch', 'Manual therapy, Ice pack', 'Anti-inflammatory', 'Initial assessment, pain on overhead movement', 45, 7, 4, 5, NULL),
(2, 1, 2, '2026-03-22', 'Pendulum swings, Internal rotation & external rotation theraband light workout ', 'Manual therapy, Ice pack', 'Anti-inflammatory', 'Initial assessment, pain on overhead movement', 45, 6, 5, 6, NULL),
(3, 4, 1, '2026-03-22', 'Complete Rest', 'Ice ', 'NSAID like Omnigel', 'Focus on lowering inflammation', 60, 8, 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(7, 'Nitin Bairwa', 'nitinbairwa@gmail.com', '$2b$10$aIIQWberIq.gleva7JyXb.kxjeOvMPGMTiFO72aT26ZzTEufzP0F2'),
(8, 'Prashant Singh Sisod', 'prashanta@gmail.com', '$2b$10$R3qvDrdFTE.np84BqlB2A.i65eWir6aow.GLvLfV26WAX.bkbadiK'),
(9, 'Nitesh Sharma', 'niteshsharma@gmail.com', '$2b$10$Mr2sIFmZy9SyLemv07qbJOx1y1TRbYQRDb8ecQkyQs9lzhAbG/hl2'),
(10, 'Lucky Rangi', 'luckyrangi@gmail.com', '$2b$10$nAlWE/DMpNszqvxjv8UAF.KOhzTvSb3lGD4Z49tt7L1LMYbIGkbQy');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cases`
--
ALTER TABLE `cases`
  ADD PRIMARY KEY (`case_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `case_id` (`case_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cases`
--
ALTER TABLE `cases`
  MODIFY `case_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
