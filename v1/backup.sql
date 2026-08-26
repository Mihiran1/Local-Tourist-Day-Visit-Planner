-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: traveldb
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attraction_images`
--

DROP TABLE IF EXISTS `attraction_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attraction_images` (
  `attraction_id` bigint NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  KEY `FK56a478by8tlqgg3fv69ko4ge8` (`attraction_id`),
  CONSTRAINT `FK56a478by8tlqgg3fv69ko4ge8` FOREIGN KEY (`attraction_id`) REFERENCES `attractions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attraction_images`
--

LOCK TABLES `attraction_images` WRITE;
/*!40000 ALTER TABLE `attraction_images` DISABLE KEYS */;
INSERT INTO `attraction_images` VALUES (5,'/uploads/attractions/48713872-a064-44df-a5e2-a7eca7eb1be3_spring-logo.jpg'),(7,'/uploads/attractions/3927f339-3d99-43ab-a4de-3243dd2c617d_koggala-lake.jpg'),(8,'/uploads/attractions/79d15acd-74df-4503-bd4b-48f535a95d47_Screenshot from 2026-08-25 21-33-47.png'),(9,'/uploads/attractions/7871f93f-5436-40ae-90fc-acaa609a95fe_Screenshot from 2026-08-25 21-02-27.png'),(10,'/uploads/attractions/da24908e-a099-4d6c-96eb-76e45249e073_Screenshot from 2026-08-25 15-04-14.png'),(11,'/uploads/attractions/3ad3ffa4-4ac2-438f-97d4-f8ef23c9d54e_Screenshot from 2026-08-23 21-37-03.png'),(12,'/uploads/attractions/acd9d2e6-ee01-4205-8378-855583cf7b72_Screenshot from 2026-08-24 20-54-47.png'),(13,'/uploads/attractions/c71ed076-a05f-4fdb-8642-f85151a1c577_Screenshot from 2026-08-25 15-04-14.png');
/*!40000 ALTER TABLE `attraction_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attractions`
--

DROP TABLE IF EXISTS `attractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attractions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `distance` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `opening_time` varchar(255) DEFAULT NULL,
  `travel_tips` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attractions`
--

LOCK TABLES `attractions` WRITE;
/*!40000 ALTER TABLE `attractions` DISABLE KEYS */;
INSERT INTO `attractions` VALUES (1,'Nature',NULL,'20km','uploads/attractions/5a3072ac-2de9-4e12-a667-f1db577b50a7_koggala-lake.jpg',NULL,NULL,'Maduru Oya National Park',NULL,NULL),(2,'Nature',NULL,'8km','/uploads/attractions/c49c44f1-862f-4364-bbef-debe7bd9e324_01.jpg',NULL,NULL,'Heninanigala Tank',NULL,NULL),(5,'Cultural','dn wewa hiddila enn epa','2 km from dehe town',NULL,7.717174,81.17094,'wewak','','kibullu innwa'),(6,'','','',NULL,NULL,NULL,'','',''),(7,'Nature & Wildlife','big lake','8',NULL,7.579144,81.086118,'henanigala tank','',''),(8,'Religious & Sacred','dcsdcdsvdsv','2',NULL,7.670562,81.044941,'cdsvsd','12:00 AM - 01:30 PM','dsdesfdsfesdcfsdcdsf'),(9,'Nature & Wildlife','asdsaaaafcds','3',NULL,7.61748,81.075153,'dsdas','',''),(10,'Nature & Wildlife','dawed','3',NULL,7.686894,81.011639,'32q3','12:30 AM - 01:30 PM','qwdd'),(11,'Cultural','ddddddddddddddddddddddd','3',NULL,NULL,NULL,'ddddddddddddddddddd','','333333333333333333333'),(12,'Religious & Sacred','6666666666666666666666666666','6',NULL,NULL,NULL,'66666666666666666666666','','6666666666666666666666'),(13,'Nature & Wildlife','6','6',NULL,NULL,NULL,'6','','6');
/*!40000 ALTER TABLE `attractions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_tokens`
--

DROP TABLE IF EXISTS `otp_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `otp_code` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKgy16pd6s8as0hxesl21n5e6l2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_tokens`
--

LOCK TABLES `otp_tokens` WRITE;
/*!40000 ALTER TABLE `otp_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-08-21 23:30:30.955637','mihiransamarasinghe5@gmail.com',_binary '','Mihiran','Samarasinghe','$2a$10$/YDfOK6hna8qkBKgZD15x.3jhKh9TyKmUuvaj/eu6tTtbAJnm5ZNG','+94764377039','ADMIN','2026-08-21 23:31:01.472157');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_plan_items`
--

DROP TABLE IF EXISTS `visit_plan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit_plan_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `visit_order` int DEFAULT NULL,
  `attraction_id` bigint NOT NULL,
  `visit_plan_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1lsq1c001nb1hif1uyixvugvr` (`attraction_id`),
  KEY `FK258r47ex6nyayb026lj9alwh0` (`visit_plan_id`),
  CONSTRAINT `FK1lsq1c001nb1hif1uyixvugvr` FOREIGN KEY (`attraction_id`) REFERENCES `attractions` (`id`),
  CONSTRAINT `FK258r47ex6nyayb026lj9alwh0` FOREIGN KEY (`visit_plan_id`) REFERENCES `visit_plans` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_plan_items`
--

LOCK TABLES `visit_plan_items` WRITE;
/*!40000 ALTER TABLE `visit_plan_items` DISABLE KEYS */;
INSERT INTO `visit_plan_items` VALUES (1,1,1,1),(2,2,2,1);
/*!40000 ALTER TABLE `visit_plan_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visit_plans`
--

DROP TABLE IF EXISTS `visit_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visit_plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `trip_date` date DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKo0nqked013wwn59o2son83iy1` (`user_id`),
  CONSTRAINT `FKo0nqked013wwn59o2son83iy1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visit_plans`
--

LOCK TABLES `visit_plans` WRITE;
/*!40000 ALTER TABLE `visit_plans` DISABLE KEYS */;
INSERT INTO `visit_plans` VALUES (1,'My Weekend Trip','2026-08-30',1);
/*!40000 ALTER TABLE `visit_plans` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-26 17:08:25
