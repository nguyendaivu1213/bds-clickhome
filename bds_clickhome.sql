-- phpMyAdmin SQL Dump
-- version 6.0.0-dev
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 19, 2026 at 02:07 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bds_clickhome`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `site_id` bigint UNSIGNED NOT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `data_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `template_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `menu_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `icon_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_target_blank` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `site_id`, `parent_id`, `data_type`, `display_position`, `template_name`, `menu_image`, `icon_image`, `is_target_blank`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, NULL, 'Dự án', NULL, NULL, 'http://localhost:8000/storage/media/mat-bang-vinhomes-green-bay-the-residence-1773455332.jpg', 'http://localhost:8000/storage/media/mat-bang-tong-the-vinhomes-green-villas-1773467488.webp', 0, 'active', '2026-03-13 05:22:54', '2026-03-13 22:55:34', NULL, NULL),
(2, 1, NULL, 'Tin tức', NULL, NULL, NULL, NULL, 0, 'active', '2026-03-17 02:14:24', '2026-03-17 02:14:24', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `category_translations`
--

CREATE TABLE `category_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `slide_images` json DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `meta_keywords` text COLLATE utf8mb4_unicode_ci,
  `header_tag` text COLLATE utf8mb4_unicode_ci,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category_translations`
--

INSERT INTO `category_translations` (`id`, `category_id`, `locale`, `title`, `subtitle`, `page_title`, `description`, `content`, `slide_images`, `meta_description`, `meta_keywords`, `header_tag`, `url`) VALUES
(1, 1, 'vi', 'Danh mục Dự án', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'du-an'),
(2, 1, 'en', 'Projects Category', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'projects'),
(3, 2, 'vi', 'fdsfdfs', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'fdsfdfs');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` bigint UNSIGNED NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faq_translations`
--

CREATE TABLE `faq_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `faq_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `folders`
--

CREATE TABLE `folders` (
  `id` bigint UNSIGNED NOT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `folders`
--

INSERT INTO `folders` (`id`, `parent_id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, NULL, 'Masteri Homes', 'active', '2026-03-13 21:02:48', '2026-03-16 04:37:09', NULL, NULL),
(2, NULL, 'Test', 'active', '2026-03-13 21:03:02', '2026-03-13 21:03:02', NULL, NULL),
(4, NULL, 'Vat Lieu', 'active', '2026-03-13 21:04:48', '2026-03-13 21:04:48', NULL, NULL),
(5, NULL, 'Final Test', 'active', '2026-03-13 21:19:43', '2026-03-13 21:19:43', NULL, NULL),
(6, 5, 'Subfolder 1', 'active', '2026-03-13 21:20:47', '2026-03-13 21:20:47', NULL, NULL),
(7, NULL, 'Projects', 'active', '2026-03-13 23:27:44', '2026-03-13 23:27:44', NULL, NULL),
(49, 6, 'test 1', 'active', '2026-03-15 23:46:07', '2026-03-15 23:46:07', NULL, NULL),
(50, 49, 'test 2', 'active', '2026-03-15 23:46:18', '2026-03-15 23:46:18', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `investors`
--

CREATE TABLE `investors` (
  `id` bigint UNSIGNED NOT NULL,
  `website_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subdomain` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intro_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `investors`
--

INSERT INTO `investors` (`id`, `website_link`, `subdomain`, `logo`, `intro_image`, `footer_image`, `about_image`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(2, NULL, 'masterise', 'http://localhost:8000/storage/media/logo-masterise-homes-1773661036.webp', 'http://localhost:8000/storage/media/image-1773661185.webp', 'http://localhost:8000/storage/media/footer-1773661247.webp', 'http://localhost:8000/storage/media/vi-tri-giaothong-era-landmark-1773454959.jpg', 'active', '2026-03-13 05:26:37', '2026-03-16 21:17:26', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `investor_translations`
--

CREATE TABLE `investor_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `investor_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `stats` json DEFAULT NULL,
  `benefits` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `investor_translations`
--

INSERT INTO `investor_translations` (`id`, `investor_id`, `locale`, `name`, `short_description`, `content`, `stats`, `benefits`) VALUES
(3, 2, 'vi', 'Masterise Homes', 'Masterise Homes là nhà phát triển bất động sản quốc tế thuộc tập đoàn Masterise Group. Họ nổi tiếng với việc tiên phong đưa phân khúc \"Bất động sản hàng hiệu\" (Branded Residences) vào Việt Nam thông qua các cú bắt tay với những ông lớn toàn cầu như Marriott International và Elie Saab.', '<p><strong>1. Các dự án \"Hàng hiệu\" tiêu biểu</strong></p><ul><li><p><span><strong>Grand Marina, Saigon (Quận 1):</strong> Khu bất động sản hàng hiệu Marriott lớn nhất thế giới.</span></p></li><li><p><span><strong>The Ritz-Carlton Residences, Hanoi (Hoàn Kiếm):</strong> Dự án siêu sang ngay trung tâm thủ đô.</span></p></li><li><p><span><strong>The Rivus (Thủ Đức):</strong> Khu dinh thự ven sông mang phong cách Haute Couture của nhà thiết kế Elie Saab.</span></p></li></ul><p><strong>2. Các dự án trọng điểm đang triển khai (2025–2026)</strong></p><ul><li><p><span><strong>The Global City (TP. Thủ Đức):</strong> Được định vị là \"Trung tâm mới\" của TP.HCM với các phân khu nổi bật như <strong>Masteri Grand View</strong> và <strong>LUMIÈRE Midtown</strong>.</span></p></li><li><p><span><strong>Dòng LUMIÈRE:</strong> Tập trung vào không gian sống xanh và sang trọng, gồm <strong>LUMIÈRE Boulevard</strong> (TP.HCM) và <strong>LUMIÈRE Evergreen</strong> (Hà Nội).</span></p></li><li><p><span><strong>Dòng Masteri:</strong> Các khu compound cao cấp như <strong>Masteri West Heights</strong>, <strong>Masteri Waterfront</strong> (Hà Nội) và <strong>Masteri Centre Point</strong> (TP.HCM).</span></p></li><li><p><span><strong>Masterise Thanh Đa:</strong> Dự án quy mô lớn tại Bình Thạnh dự kiến ra mắt trong năm 2026.</span></p></li></ul><p><strong>3. Điểm khác biệt của Masterise Homes</strong></p><ul><li><p><span><strong>Tiêu chuẩn quốc tế:</strong> Hợp tác với các đối tác thiết kế và quản lý hàng đầu thế giới (Tange Associates, Foster + Partners).</span></p></li><li><p><span><strong>Hệ sinh thái tài chính:</strong> Liên kết chặt chẽ với <strong>Techcombank</strong> để hỗ trợ các gói vay và giải pháp \"Đổi nhà\" (Home for Home).</span></p></li><li><p><span><strong>Dịch vụ quản lý:</strong> Có đơn vị Masterise Property Management riêng để đảm bảo chất lượng vận hành sau khi bàn giao.</span></p></li></ul><p><br></p>', '[]', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `code`, `name`, `is_default`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'vi', 'Vietnamese', 1, 'active', '2026-03-13 05:22:54', '2026-03-13 05:22:54', NULL, NULL),
(2, 'en', 'English', 0, 'active', '2026-03-13 05:22:54', '2026-03-13 05:22:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` bigint UNSIGNED NOT NULL,
  `folder_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preview_file` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_size` bigint UNSIGNED DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `folder_id`, `name`, `original_file`, `file_type`, `thumbnail_file`, `preview_file`, `file_size`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, NULL, 'vinhomes-thang-long-background.jpg', 'media/vinhomes-thang-long-background-1773454752.jpg', 'jpg', NULL, NULL, 592491, 'active', '2026-03-13 19:19:12', '2026-03-13 19:19:12', NULL, NULL),
(2, NULL, 'vi-tri-giaothong-era-landmark.jpg', 'media/vi-tri-giaothong-era-landmark-1773454959.jpg', 'jpg', NULL, NULL, 757558, 'active', '2026-03-13 19:22:39', '2026-03-13 19:22:39', NULL, NULL),
(3, NULL, 'vinhomes-times-city.jpg', 'media/vinhomes-times-city-1773455299.jpg', 'jpg', NULL, NULL, 90277, 'active', '2026-03-13 19:28:19', '2026-03-13 19:28:19', NULL, NULL),
(4, NULL, 'mat-bang-vinhomes-green-bay-the-residence.jpg', 'media/mat-bang-vinhomes-green-bay-the-residence-1773455332.jpg', 'jpg', NULL, NULL, 784486, 'active', '2026-03-13 19:28:53', '2026-03-13 19:28:53', NULL, NULL),
(7, 5, 'test_file.txt', 'media/test-file-1773468602.txt', 'txt', NULL, NULL, 25, 'active', '2026-03-13 23:10:02', '2026-03-13 23:10:02', NULL, NULL),
(8, 1, 'Logo-Masterise-Homes.png', 'media/logo-masterise-homes-1773661036.webp', 'webp', 'media/logo-masterise-homes-1773661036-thumb.webp', 'media/logo-masterise-homes-1773661036-preview.webp', 48079, 'active', '2026-03-16 04:37:17', '2026-03-16 04:37:17', NULL, NULL),
(9, 1, 'image.jpg', 'media/image-1773661185.webp', 'webp', 'media/image-1773661185-thumb.webp', 'media/image-1773661185-preview.webp', 300358, 'active', '2026-03-16 04:39:46', '2026-03-16 04:39:46', NULL, NULL),
(10, 1, 'footer.jpg', 'media/footer-1773661247.webp', 'webp', 'media/footer-1773661247-thumb.webp', 'media/footer-1773661247-preview.webp', 508893, 'active', '2026-03-16 04:40:48', '2026-03-16 04:40:48', NULL, NULL),
(11, 2, 'logo.png', 'media/logo-1773662874.webp', 'webp', 'media/logo-1773662874-thumb.webp', 'media/logo-1773662874-preview.webp', 104410, 'active', '2026-03-16 05:07:54', '2026-03-16 05:07:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(25, '0001_01_01_000000_create_users_table', 1),
(26, '0001_01_01_000001_create_cache_table', 1),
(27, '0001_01_01_000002_create_jobs_table', 1),
(28, '2026_03_13_000001_create_sites_table', 1),
(29, '2026_03_13_000002_create_languages_table', 1),
(30, '2026_03_13_000003_create_site_settings_table', 1),
(31, '2026_03_13_000004_create_categories_table', 1),
(32, '2026_03_13_000005_create_category_translations_table', 1),
(33, '2026_03_13_000006_create_investors_table', 1),
(34, '2026_03_13_000007_create_investor_translations_table', 1),
(35, '2026_03_13_000008_create_faqs_table', 1),
(36, '2026_03_13_000009_create_faq_translations_table', 1),
(37, '2026_03_13_000010_create_projects_table', 1),
(38, '2026_03_13_000011_create_project_translations_table', 1),
(39, '2026_03_13_000012_create_project_category_table', 1),
(40, '2026_03_13_000013_create_project_faqs_table', 1),
(41, '2026_03_13_000014_create_project_zones_table', 1),
(42, '2026_03_13_000015_create_project_zone_translations_table', 1),
(43, '2026_03_13_000016_create_zone_articles_table', 1),
(44, '2026_03_13_000017_create_zone_article_translations_table', 1),
(45, '2026_03_13_000018_create_project_articles_table', 1),
(46, '2026_03_13_000019_create_project_article_translations_table', 1),
(47, '2026_03_13_000020_create_properties_table', 1),
(48, '2026_03_13_000021_create_property_translations_table', 1),
(49, '2026_03_13_000022_create_folders_table', 1),
(50, '2026_03_13_000023_create_media_table', 1),
(51, '2026_03_15_152510_add_tags_and_is_published_to_projects_table', 2),
(52, '2026_03_16_162554_create_posts_table', 3),
(53, '2026_03_16_163001_create_post_translations_table', 3),
(54, '2026_03_16_163002_create_tags_table', 3),
(55, '2026_03_16_163003_create_tag_translations_table', 3),
(56, '2026_03_16_163004_create_post_tags_table', 3),
(57, '2026_03_16_163005_create_post_views_table', 3),
(58, '2026_03_16_163006_create_writer_payments_table', 3),
(59, '2026_03_17_040202_add_about_fields_to_investors_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint UNSIGNED NOT NULL,
  `site_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED DEFAULT NULL,
  `author_id` bigint UNSIGNED DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft',
  `featured_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `site_id`, `category_id`, `author_id`, `slug`, `status`, `featured_image`, `published_at`, `created_at`, `updated_at`) VALUES
(4, 1, 2, 1, 'this-is-a-test2', 'published', 'http://localhost:8000/storage/media/vinhomes-times-city-1773455299.jpg', NULL, '2026-03-17 02:42:56', '2026-03-17 02:47:25'),
(5, 1, 2, 1, 'this-is-a-test-5', 'published', 'http://localhost:8000/storage/media/vinhomes-thang-long-background-1773454752.jpg', NULL, '2026-03-17 02:45:55', '2026-03-17 02:48:10');

-- --------------------------------------------------------

--
-- Table structure for table `post_tags`
--

CREATE TABLE `post_tags` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `tag_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `post_translations`
--

CREATE TABLE `post_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'vi',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `seo_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text COLLATE utf8mb4_unicode_ci,
  `seo_keywords` text COLLATE utf8mb4_unicode_ci,
  `canonical_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_translations`
--

INSERT INTO `post_translations` (`id`, `post_id`, `locale`, `title`, `excerpt`, `content`, `seo_title`, `seo_description`, `seo_keywords`, `canonical_url`, `created_at`, `updated_at`) VALUES
(1, 4, 'vi', 'This is a test', 'dsdsds', '<p>dsds</p>', NULL, NULL, NULL, NULL, '2026-03-17 02:42:56', '2026-03-17 02:42:56'),
(2, 5, 'vi', 'This is a test', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 02:45:55', '2026-03-17 02:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `post_views`
--

CREATE TABLE `post_views` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `views` int NOT NULL DEFAULT '0',
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint UNSIGNED NOT NULL,
  `site_id` bigint UNSIGNED NOT NULL,
  `investor_id` bigint UNSIGNED DEFAULT NULL,
  `primary_category_id` bigint UNSIGNED DEFAULT NULL,
  `perspective_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `google_map` text COLLATE utf8mb4_unicode_ci,
  `location_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sample_apartment_360` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `living_room_360` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bedroom_360` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `balcony_360` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amenities_360` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `is_published` tinyint(1) NOT NULL DEFAULT '0',
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `site_id`, `investor_id`, `primary_category_id`, `perspective_image`, `footer_image`, `publish_date`, `google_map`, `location_image`, `sample_apartment_360`, `living_room_360`, `bedroom_360`, `balcony_360`, `amenities_360`, `contact_email`, `contact_phone`, `status`, `is_published`, `display_order`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(4, 1, NULL, 1, 'http://localhost:8000/storage/media/mat-bang-vinhomes-green-bay-the-residence-1773455332.jpg', 'http://localhost:8000/storage/media/vinhomes-times-city-1773455299.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Planning', 1, 0, '2026-03-15 07:35:40', '2026-03-15 09:54:31', NULL, NULL),
(5, 1, 2, 1, 'http://localhost:8000/storage/media/vinhomes-thang-long-background-1773454752.jpg', 'http://localhost:8000/storage/media/footer-1773661247.webp', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'active', 1, 0, '2026-03-15 07:40:03', '2026-03-16 11:25:34', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_articles`
--

CREATE TABLE `project_articles` (
  `id` bigint UNSIGNED NOT NULL,
  `project_id` bigint UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_articles`
--

INSERT INTO `project_articles` (`id`, `project_id`, `type`, `banner_image`, `status`, `display_order`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 5, 'location', 'http://localhost:8000/storage/media/vi-tri-giaothong-era-landmark-1773454959.jpg', 'published', 1, '2026-03-17 02:46:55', '2026-03-17 02:46:55', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_article_translations`
--

CREATE TABLE `project_article_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `project_article_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `page_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `html_content` longtext COLLATE utf8mb4_unicode_ci,
  `slide_images` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_article_translations`
--

INSERT INTO `project_article_translations` (`id`, `project_article_id`, `locale`, `title`, `page_title`, `summary`, `html_content`, `slide_images`) VALUES
(1, 1, 'vi', 'This is a test', 'This is a test', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_category`
--

CREATE TABLE `project_category` (
  `project_id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_faqs`
--

CREATE TABLE `project_faqs` (
  `project_id` bigint UNSIGNED NOT NULL,
  `faq_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_translations`
--

CREATE TABLE `project_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `project_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slogan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci,
  `overview_description` text COLLATE utf8mb4_unicode_ci,
  `tags` text COLLATE utf8mb4_unicode_ci,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` text COLLATE utf8mb4_unicode_ci,
  `meta_keywords` text COLLATE utf8mb4_unicode_ci,
  `header_tag` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scale` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_types` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `design` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apartment_types` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `handover_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `legal_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `html_content` longtext COLLATE utf8mb4_unicode_ci,
  `location_content` longtext COLLATE utf8mb4_unicode_ci,
  `slide_images` json DEFAULT NULL,
  `map_360_links` json DEFAULT NULL,
  `master_plan` json DEFAULT NULL,
  `zone_planning` json DEFAULT NULL,
  `building_locations` json DEFAULT NULL,
  `studio_layouts` json DEFAULT NULL,
  `1br_layouts` json DEFAULT NULL,
  `2br_layouts` json DEFAULT NULL,
  `3br_layouts` json DEFAULT NULL,
  `duplex_layouts` json DEFAULT NULL,
  `other_layouts` json DEFAULT NULL,
  `amenities` json DEFAULT NULL,
  `handover_standards` json DEFAULT NULL,
  `images` json DEFAULT NULL,
  `videos` json DEFAULT NULL,
  `construction_progress` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_translations`
--

INSERT INTO `project_translations` (`id`, `project_id`, `locale`, `name`, `slogan`, `short_description`, `overview_description`, `tags`, `url`, `page_title`, `meta_description`, `meta_keywords`, `header_tag`, `location`, `scale`, `product_types`, `design`, `apartment_types`, `area`, `handover_time`, `legal_status`, `html_content`, `location_content`, `slide_images`, `map_360_links`, `master_plan`, `zone_planning`, `building_locations`, `studio_layouts`, `1br_layouts`, `2br_layouts`, `3br_layouts`, `duplex_layouts`, `other_layouts`, `amenities`, `handover_standards`, `images`, `videos`, `construction_progress`) VALUES
(5, 4, 'vi', 'this is a test', 'this is a test', 'this is a test', '<p>this is a test</p>', 'this is a test', 'thisisatest', NULL, NULL, '', 'h1', NULL, NULL, 'Căn hộ chung cư', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL, NULL, NULL),
(6, 5, 'vi', 'MASTERI GRAND COAST', 'MASTERI GRAND COAST- SỐNG PHONG THÁI TỰ DO', 'Vươn cao mạnh mẽ ôm trọn mặt hồ Wonder Wave Park, Masteri Grand Coast hiện diện như một dấu ấn của phong thái tự do giữa tầng không, nơi mỗi tầm nhìn khoáng đạt không chỉ mở ra những sắc xanh bất tận của mặt nước, cỏ cây mà còn dẫn lối nhịp sống quốc tế sôi động của thành phố biển hồ.', '<ul><li><p>Tên dự án:&nbsp; MASTERI GRAND COAST</p></li><li><p>Chủ đầu tư:&nbsp; Masterise Homes</p></li><li><p>Vị trí:&nbsp; Khu đô thị Vinhomes Ocean Park 2 – Ocean City, Văn Giang, tỉnh Hưng Yên</p></li><li><p>Quy mô tổng thể: 72,498 &nbsp;m²</p></li><li><p>Quy mô: 7 Toà -&nbsp;Phân khu The Wave (3 toà) &amp;&nbsp;Phân khu The Sand (4 toà)</p></li><li><p>Tiện ích:&nbsp;&nbsp;Dự án sở hữu hệ sinh thái hơn 180 tiện ích nội khu đẳng cấp (nhiều nhất Masteri Collection), nổi bật với 4 công viên chủ đề, bể bơi vô cực/Olympic, Jacuzzi, Gym, Yoga, Business Lounge và cảnh quan 5,3 ha. Dự án còn thừa hưởng trọn vẹn tiện ích ngoại khu gồm VinWonders Wave Park, Vincom, Vinmec, Vinschool.</p></li><li><p>Dự kiến bàn giao: Quý 3/2028</p></li><li><p>Pháp lý: Sở hữu lâu dài.</p></li><li><p>Sản phẩm: Studio, 1PN, 1 PN+, 2PN, 2PN+, 3PN, 4PN, Duplex, Penthouse</p></li></ul>', 'masteri,MASTERI GRAND COAST,SỐNG PHONG THÁI TỰ DO', 'masteri-grand-coast', NULL, NULL, '', 'h1', NULL, NULL, 'Căn hộ chung cư', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[{\"desc\": null, \"image\": null, \"title\": null, \"isHighlight\": false}]', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_zones`
--

CREATE TABLE `project_zones` (
  `id` bigint UNSIGNED NOT NULL,
  `project_id` bigint UNSIGNED NOT NULL,
  `intro_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_overview_page` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_zones`
--

INSERT INTO `project_zones` (`id`, `project_id`, `intro_image`, `is_overview_page`, `status`, `display_order`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 5, NULL, 0, 'active', 0, '2026-03-17 02:15:28', '2026-03-17 02:15:28', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `project_zone_translations`
--

CREATE TABLE `project_zone_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `project_zone_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `page_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_zone_translations`
--

INSERT INTO `project_zone_translations` (`id`, `project_zone_id`, `locale`, `name`, `page_title`, `slug`) VALUES
(1, 1, 'vi', 'Block A', 'Block A', 'block-a');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` bigint UNSIGNED NOT NULL,
  `project_id` bigint UNSIGNED NOT NULL,
  `zone_id` bigint UNSIGNED DEFAULT NULL,
  `product_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `area` decimal(10,2) DEFAULT NULL,
  `price` decimal(15,2) DEFAULT NULL,
  `main_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `property_translations`
--

CREATE TABLE `property_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `property_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `html_content` longtext COLLATE utf8mb4_unicode_ci,
  `slide_images` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('GOJwNsCRg3kAyPV5SqHxhwkk0WFYlyLsBOml8CUy', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibFJsOWVLNjFZMFdOeHJoMGVhSE5Gb3N0cHBmTHhLWENybEZ0SWlJVCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773418718),
('hCzJs0LNZa6vUOZK4hBQtoiqaw63J5UcSfUt4730', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQjNYN2ozVzQ4dDlvMGRCMFhwYVFKTGtCOWRNbVU0YlBHVzFHNFJ3cyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1773454376);

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `domain` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `theme` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_language` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'vi',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`id`, `name`, `domain`, `slug`, `theme`, `default_language`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'ClickHomes', 'clickhomes.vn', 'clickhomes', NULL, 'vi', 'active', '2026-03-13 05:22:54', '2026-03-13 05:22:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint UNSIGNED NOT NULL,
  `site_id` bigint UNSIGNED NOT NULL,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`id`, `site_id`, `key`, `value`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, 'logo', 'http://localhost:8000/storage/media/logo-1773662874.webp', '2026-03-13 05:22:54', '2026-03-16 05:08:02', NULL, NULL),
(2, 1, 'dynamic_selections', '[{\"id\":\"1\",\"name\":\"Loai Du Lieu\",\"key\":\"category_data_type\",\"options\":[{\"id\":\"o1\",\"label\":\"Tin tuc\",\"value\":\"Tin tuc\"},{\"id\":\"o2\",\"label\":\"Du an\",\"value\":\"Du an\"},{\"id\":\"o3\",\"label\":\"Gioi thieu\",\"value\":\"Gioi thieu\"},{\"id\":\"o4\",\"label\":\"Khac\",\"value\":\"Khac\"}]},{\"id\":\"2\",\"name\":\"Vi Tri Hien Thi\",\"key\":\"display_position\",\"options\":[{\"id\":\"o5\",\"label\":\"Đầu trang (Top)\",\"value\":\"top\"},{\"id\":\"o6\",\"label\":\"Chan trang (Footer)\",\"value\":\"footer\"},{\"id\":\"o7\",\"label\":\"Thanh ben (Sidebar)\",\"value\":\"sidebar\"}]}]', '2026-03-13 09:12:23', '2026-03-13 17:15:52', NULL, NULL),
(3, 1, 'site_name', 'ClickHomes.vn – Thông tin dự án & bất động sản cao cấp', '2026-03-13 17:15:52', '2026-03-16 05:08:02', NULL, NULL),
(4, 1, 'hotline', '1900 123456', '2026-03-13 17:15:52', '2026-03-16 04:54:32', NULL, NULL),
(5, 1, 'support_email', 'sales@clickhomes.vn', '2026-03-13 17:15:52', '2026-03-16 04:54:32', NULL, NULL),
(6, 1, 'address', '123 Đường ABC, Phường EDF, GHIK, Việt Nam', '2026-03-16 20:31:33', '2026-03-16 20:31:33', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint UNSIGNED NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tag_translations`
--

CREATE TABLE `tag_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `tag_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'vi',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','editor','writer','seo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'writer',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `status`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@clickhomes.vn', NULL, '$2y$12$oFCCsx5z/P5EL/yfYQbiI.TkjBJN6460HdGsgZoTm.f6tbS/gjf8q', 'admin', 'active', NULL, '2026-03-13 05:22:54', '2026-03-13 05:22:54');

-- --------------------------------------------------------

--
-- Table structure for table `writer_payments`
--

CREATE TABLE `writer_payments` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `word_count` int NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zone_articles`
--

CREATE TABLE `zone_articles` (
  `id` bigint UNSIGNED NOT NULL,
  `zone_id` bigint UNSIGNED NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `display_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `updated_by` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `zone_article_translations`
--

CREATE TABLE `zone_article_translations` (
  `id` bigint UNSIGNED NOT NULL,
  `zone_article_id` bigint UNSIGNED NOT NULL,
  `locale` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `page_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `html_content` longtext COLLATE utf8mb4_unicode_ci,
  `slide_images` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_site_id_foreign` (`site_id`),
  ADD KEY `categories_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `category_translations`
--
ALTER TABLE `category_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_translations_category_id_locale_unique` (`category_id`,`locale`),
  ADD KEY `category_translations_locale_index` (`locale`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faq_translations`
--
ALTER TABLE `faq_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `faq_translations_faq_id_locale_unique` (`faq_id`,`locale`),
  ADD KEY `faq_translations_locale_index` (`locale`);

--
-- Indexes for table `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `folders_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `investors`
--
ALTER TABLE `investors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investor_translations`
--
ALTER TABLE `investor_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `investor_translations_investor_id_locale_unique` (`investor_id`,`locale`),
  ADD KEY `investor_translations_locale_index` (`locale`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_reserved_at_available_at_index` (`queue`,`reserved_at`,`available_at`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `languages_code_unique` (`code`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `media_folder_id_foreign` (`folder_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `posts_slug_unique` (`slug`),
  ADD KEY `posts_site_id_foreign` (`site_id`),
  ADD KEY `posts_category_id_foreign` (`category_id`),
  ADD KEY `posts_author_id_foreign` (`author_id`);

--
-- Indexes for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_tags_post_id_tag_id_unique` (`post_id`,`tag_id`),
  ADD KEY `post_tags_tag_id_foreign` (`tag_id`);

--
-- Indexes for table `post_translations`
--
ALTER TABLE `post_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_translations_post_id_locale_unique` (`post_id`,`locale`),
  ADD KEY `post_translations_locale_index` (`locale`);

--
-- Indexes for table `post_views`
--
ALTER TABLE `post_views`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_views_post_id_date_unique` (`post_id`,`date`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_site_id_foreign` (`site_id`),
  ADD KEY `projects_investor_id_foreign` (`investor_id`),
  ADD KEY `projects_primary_category_id_foreign` (`primary_category_id`);

--
-- Indexes for table `project_articles`
--
ALTER TABLE `project_articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_articles_project_id_foreign` (`project_id`);

--
-- Indexes for table `project_article_translations`
--
ALTER TABLE `project_article_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_article_translations_project_article_id_locale_unique` (`project_article_id`,`locale`),
  ADD KEY `project_article_translations_locale_index` (`locale`);

--
-- Indexes for table `project_category`
--
ALTER TABLE `project_category`
  ADD PRIMARY KEY (`project_id`,`category_id`),
  ADD KEY `project_category_category_id_foreign` (`category_id`);

--
-- Indexes for table `project_faqs`
--
ALTER TABLE `project_faqs`
  ADD PRIMARY KEY (`project_id`,`faq_id`),
  ADD KEY `project_faqs_faq_id_foreign` (`faq_id`);

--
-- Indexes for table `project_translations`
--
ALTER TABLE `project_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_translations_project_id_locale_unique` (`project_id`,`locale`),
  ADD KEY `project_translations_locale_index` (`locale`);

--
-- Indexes for table `project_zones`
--
ALTER TABLE `project_zones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_zones_project_id_foreign` (`project_id`);

--
-- Indexes for table `project_zone_translations`
--
ALTER TABLE `project_zone_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `project_zone_translations_project_zone_id_locale_unique` (`project_zone_id`,`locale`),
  ADD KEY `project_zone_translations_locale_index` (`locale`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `properties_project_id_foreign` (`project_id`),
  ADD KEY `properties_zone_id_foreign` (`zone_id`);

--
-- Indexes for table `property_translations`
--
ALTER TABLE `property_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_translations_property_id_locale_unique` (`property_id`,`locale`),
  ADD KEY `property_translations_locale_index` (`locale`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sites_domain_unique` (`domain`),
  ADD UNIQUE KEY `sites_slug_unique` (`slug`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_settings_site_id_key_unique` (`site_id`,`key`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tags_slug_unique` (`slug`);

--
-- Indexes for table `tag_translations`
--
ALTER TABLE `tag_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tag_translations_tag_id_locale_unique` (`tag_id`,`locale`),
  ADD KEY `tag_translations_locale_index` (`locale`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `writer_payments`
--
ALTER TABLE `writer_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `writer_payments_post_id_foreign` (`post_id`),
  ADD KEY `writer_payments_user_id_foreign` (`user_id`);

--
-- Indexes for table `zone_articles`
--
ALTER TABLE `zone_articles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `zone_articles_zone_id_foreign` (`zone_id`);

--
-- Indexes for table `zone_article_translations`
--
ALTER TABLE `zone_article_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `zone_article_translations_zone_article_id_locale_unique` (`zone_article_id`,`locale`),
  ADD KEY `zone_article_translations_locale_index` (`locale`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `category_translations`
--
ALTER TABLE `category_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `faq_translations`
--
ALTER TABLE `faq_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `folders`
--
ALTER TABLE `folders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `investors`
--
ALTER TABLE `investors`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `investor_translations`
--
ALTER TABLE `investor_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `post_tags`
--
ALTER TABLE `post_tags`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post_translations`
--
ALTER TABLE `post_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `post_views`
--
ALTER TABLE `post_views`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `project_articles`
--
ALTER TABLE `project_articles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_article_translations`
--
ALTER TABLE `project_article_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_translations`
--
ALTER TABLE `project_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `project_zones`
--
ALTER TABLE `project_zones`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `project_zone_translations`
--
ALTER TABLE `project_zone_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `property_translations`
--
ALTER TABLE `property_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tag_translations`
--
ALTER TABLE `tag_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `writer_payments`
--
ALTER TABLE `writer_payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zone_articles`
--
ALTER TABLE `zone_articles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `zone_article_translations`
--
ALTER TABLE `zone_article_translations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `categories_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `category_translations`
--
ALTER TABLE `category_translations`
  ADD CONSTRAINT `category_translations_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `faq_translations`
--
ALTER TABLE `faq_translations`
  ADD CONSTRAINT `faq_translations_faq_id_foreign` FOREIGN KEY (`faq_id`) REFERENCES `faqs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `folders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `investor_translations`
--
ALTER TABLE `investor_translations`
  ADD CONSTRAINT `investor_translations_investor_id_foreign` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_folder_id_foreign` FOREIGN KEY (`folder_id`) REFERENCES `folders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `posts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `posts_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD CONSTRAINT `post_tags_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_tags_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_translations`
--
ALTER TABLE `post_translations`
  ADD CONSTRAINT `post_translations_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post_views`
--
ALTER TABLE `post_views`
  ADD CONSTRAINT `post_views_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_investor_id_foreign` FOREIGN KEY (`investor_id`) REFERENCES `investors` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `projects_primary_category_id_foreign` FOREIGN KEY (`primary_category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `projects_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_articles`
--
ALTER TABLE `project_articles`
  ADD CONSTRAINT `project_articles_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_article_translations`
--
ALTER TABLE `project_article_translations`
  ADD CONSTRAINT `project_article_translations_project_article_id_foreign` FOREIGN KEY (`project_article_id`) REFERENCES `project_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_category`
--
ALTER TABLE `project_category`
  ADD CONSTRAINT `project_category_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_category_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_faqs`
--
ALTER TABLE `project_faqs`
  ADD CONSTRAINT `project_faqs_faq_id_foreign` FOREIGN KEY (`faq_id`) REFERENCES `faqs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_faqs_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_translations`
--
ALTER TABLE `project_translations`
  ADD CONSTRAINT `project_translations_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_zones`
--
ALTER TABLE `project_zones`
  ADD CONSTRAINT `project_zones_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_zone_translations`
--
ALTER TABLE `project_zone_translations`
  ADD CONSTRAINT `project_zone_translations_project_zone_id_foreign` FOREIGN KEY (`project_zone_id`) REFERENCES `project_zones` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `properties`
--
ALTER TABLE `properties`
  ADD CONSTRAINT `properties_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `properties_zone_id_foreign` FOREIGN KEY (`zone_id`) REFERENCES `project_zones` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `property_translations`
--
ALTER TABLE `property_translations`
  ADD CONSTRAINT `property_translations_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD CONSTRAINT `site_settings_site_id_foreign` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tag_translations`
--
ALTER TABLE `tag_translations`
  ADD CONSTRAINT `tag_translations_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `writer_payments`
--
ALTER TABLE `writer_payments`
  ADD CONSTRAINT `writer_payments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `writer_payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `zone_articles`
--
ALTER TABLE `zone_articles`
  ADD CONSTRAINT `zone_articles_zone_id_foreign` FOREIGN KEY (`zone_id`) REFERENCES `project_zones` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `zone_article_translations`
--
ALTER TABLE `zone_article_translations`
  ADD CONSTRAINT `zone_article_translations_zone_article_id_foreign` FOREIGN KEY (`zone_article_id`) REFERENCES `zone_articles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
