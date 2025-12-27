-- Script untuk membuat tabel member_foto jika belum ada
-- Jalankan script ini di database MySQL Anda

CREATE TABLE IF NOT EXISTS `member_foto` (
  `foto_id` INT AUTO_INCREMENT PRIMARY KEY,
  `member_id` INT NOT NULL,
  `foto` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`member_id`) REFERENCES `member_data_diri`(`member_id`) ON DELETE CASCADE,
  INDEX `idx_member_id` (`member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

