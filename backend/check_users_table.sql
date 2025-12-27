-- Script untuk memeriksa dan membuat kolom password di tabel users jika belum ada

-- 1. Cek struktur tabel users
DESCRIBE users;

-- 2. Jika kolom password belum ada, tambahkan dengan query berikut:
-- ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL AFTER email;

-- 3. Jika kolom member_id belum ada, tambahkan dengan query berikut:
-- ALTER TABLE users ADD COLUMN member_id INT(11) NULL AFTER role;

