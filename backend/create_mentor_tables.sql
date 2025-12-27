-- ============================================
-- CREATE TABLES FOR MENTOR REGISTRATION
-- ============================================

-- Update users table to add foto column for mentor
ALTER TABLE `users` 
ADD COLUMN IF NOT EXISTS `foto` VARCHAR(255) NULL AFTER `phone`;

-- Create mentor_profiles table
CREATE TABLE IF NOT EXISTS `mentor_profiles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  
  -- Biodata Diri
  `tempat_lahir` VARCHAR(100) NULL,
  `tanggal_lahir` DATE NULL,
  `jenis_kelamin` ENUM('L', 'P') NULL,
  `alamat` TEXT NULL,
  
  -- Bahasa yang akan diajarkan (universal - hanya 3 pilihan)
  `bahasa_inggris` BOOLEAN DEFAULT FALSE,
  `bahasa_korea` BOOLEAN DEFAULT FALSE,
  `bahasa_jepang` BOOLEAN DEFAULT FALSE,
  
  -- Informasi tambahan
  `pengalaman_mengajar` TEXT NULL,
  `alasan_menjadi_mentor` TEXT NULL,
  
  -- Status approval
  `admin_notes` TEXT NULL,
  `approved_at` TIMESTAMP NULL,
  `approved_by` INT NULL,
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create mentor_pendidikan table (untuk riwayat pendidikan multiple)
CREATE TABLE IF NOT EXISTS `mentor_pendidikan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `mentor_profile_id` INT NOT NULL,
  `tingkat` ENUM('SMA', 'D3', 'S1', 'S2', 'S3', 'Lainnya') NOT NULL,
  `tingkat_lainnya` VARCHAR(100) NULL,
  `jurusan` VARCHAR(255) NOT NULL,
  `universitas` VARCHAR(255) NOT NULL,
  `tahun_masuk` YEAR NULL,
  `tahun_lulus` YEAR NOT NULL,
  `ijazah_file` VARCHAR(255) NULL,
  `urutan` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`mentor_profile_id`) REFERENCES `mentor_profiles`(`id`) ON DELETE CASCADE,
  INDEX `idx_mentor_profile_id` (`mentor_profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create mentor_sertifikat table (untuk sertifikat skill multiple)
CREATE TABLE IF NOT EXISTS `mentor_sertifikat` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `mentor_profile_id` INT NOT NULL,
  `nama_sertifikat` VARCHAR(255) NOT NULL,
  `penerbit` VARCHAR(255) NOT NULL,
  `tahun` YEAR NOT NULL,
  `file` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (`mentor_profile_id`) REFERENCES `mentor_profiles`(`id`) ON DELETE CASCADE,
  INDEX `idx_mentor_profile_id` (`mentor_profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

