-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 21 Des 2025 pada 07.56
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lpk_dashboard`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `berita`
--

CREATE TABLE `berita` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `berita`
--

INSERT INTO `berita` (`id`, `title`, `content`, `image`) VALUES
(20, 'Info Loker', 'ddsljdlksjdskdjlsjdlksjdlksjkldjksjdljskdlsalkdkjshdfkjhdslkfjhdkjsfhjkdshfjkhdsfdjksfhjkdsfhsdjfhjdshfhdkjfhkjdfhdjkfhjkdfdjhfdf', '1766041890444-653284580.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `schedule` varchar(100) DEFAULT NULL,
  `mentor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `galeri`
--

CREATE TABLE `galeri` (
  `id` int(11) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `galeri`
--

INSERT INTO `galeri` (`id`, `caption`, `image`) VALUES
(51, 'hahahaha', '1766043049915-105033943.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kontak`
--

CREATE TABLE `kontak` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pesan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kontak`
--

INSERT INTO `kontak` (`id`, `nama`, `email`, `pesan`) VALUES
(1, 'aldaka triyanti', 'aldaka@gmail.com', 'coba coba'),
(2, 'aky', 'coba@gmail.com', 'cara daftar min'),
(3, 'aldaka', 'aldaka@gmail.com', 'apalah');

-- --------------------------------------------------------

--
-- Struktur dari tabel `member_data_diri`
--

CREATE TABLE `member_data_diri` (
  `member_id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `umur` int(11) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `kewarganegaraan` varchar(100) DEFAULT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat_rumah` text DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `tujuan` varchar(150) DEFAULT NULL,
  `gol_darah` varchar(5) DEFAULT NULL,
  `hobi` varchar(150) DEFAULT NULL,
  `agama` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `member_data_diri`
--

INSERT INTO `member_data_diri` (`member_id`, `nama`, `email`, `umur`, `gender`, `status`, `kewarganegaraan`, `tempat_lahir`, `tanggal_lahir`, `alamat_rumah`, `no_hp`, `tujuan`, `gol_darah`, `hobi`, `agama`, `created_at`) VALUES
(114, 'Aldaka Triyanti Agustina Basuki', NULL, 21, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-12', 'SUMATERA BARAT, KABUPATEN SOLOK, BUKIT SUNDI, PARAMBAHAN, ', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:15:13'),
(115, 'Aldaka Triyanti Agustina Basuki', NULL, 21, 'pr', 'kerja', 'indonesia', 'Lamongan', '2025-12-06', 'SUMATERA UTARA, KABUPATEN SIMALUNGUN, TANAH JAWA, BOSAR GALUGUR, ', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:19:13'),
(116, 'Aldaka Triyanti Agustina Basuki', NULL, 21, 'pr', 'kerja', 'indonesia', 'Lamongan', '2025-12-06', 'SUMATERA UTARA, KABUPATEN SIMALUNGUN, TANAH JAWA, BOSAR GALUGUR, ', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:19:37'),
(117, 'Aldaka Triyanti A B', NULL, 21, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-19', 'RIAU, KABUPATEN INDRAGIRI HILIR, TEMBILAHAN, TEMBILAHAN KOTA, ', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:22:30'),
(118, 'Aldaka Triyanti A B', NULL, 21, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-19', 'RIAU, KABUPATEN INDRAGIRI HILIR, TEMBILAHAN, TEMBILAHAN KOTA, ', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:25:08'),
(119, 'Aldaka Triyanti Agustina Basuki', NULL, 21, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-27', 'RIAU, KABUPATEN INDRAGIRI HULU, LIRIK, LAMBANG SARI I, II, III, asssssssssssa', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:25:42'),
(120, 'Aldaka Triyanti Agustina Basuki', NULL, 28, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-23', 'SUMATERA UTARA, KABUPATEN TAPANULI TENGAH, TAPIAN NAULI, TAPIAN NAULI III, aaaaaaaaaa', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:29:40'),
(121, 'Aldaka Triyanti Agustina Basuki', NULL, 28, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-23', 'SUMATERA UTARA, KABUPATEN TAPANULI TENGAH, TAPIAN NAULI, TAPIAN NAULI III, aaaaaaaaaa', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:29:40'),
(122, 'Aldaka Triyanti Agustina Basuki', NULL, 21, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-10', 'SUMATERA UTARA, KABUPATEN DAIRI, SIEMPAT NEMPU HULU, PANGARIBUAN', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:32:35'),
(123, 'Aldaka Triyanti Agustina Basuki', NULL, 21, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-10', 'SUMATERA UTARA, KABUPATEN DAIRI, SIEMPAT NEMPU HULU, PANGARIBUAN', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 11:32:36'),
(124, 'Aldaka Triyanti Agustina Basuki', NULL, 21, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-05', 'SUMATERA UTARA, KABUPATEN LANGKAT, SECANGGANG, SUNGAI ULAR', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 12:00:22'),
(125, 'Aldaka Triyanti Agustina Basuki', NULL, 21, 'pr', 'kerja', 'indo', 'Lamongan', '2025-12-05', 'SUMATERA UTARA, KABUPATEN LANGKAT, SECANGGANG, SUNGAI ULAR', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 12:00:23'),
(126, 'Aldaka Triyanti A B', NULL, 21, 'pr', 'aaa', 'indo', 'Lamongan', '2025-12-06', 'SUMATERA BARAT, KABUPATEN AGAM, BASO, SIMARASOK', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 12:07:44'),
(127, 'Aldaka Triyanti A B', NULL, 21, 'pr', 'aaa', 'indo', 'Lamongan', '2025-12-06', 'SUMATERA BARAT, KABUPATEN AGAM, BASO, SIMARASOK', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 12:07:45'),
(128, 'Aldaka Triyanti A B', NULL, 21, 'pr', 'aaa', 'indo', 'Lamongan', '2025-12-06', 'SUMATERA BARAT, KABUPATEN AGAM, BASO, SIMARASOK', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 12:08:07'),
(129, 'Aldaka Triyanti A B', NULL, 21, 'pr', 'aaa', 'indo', 'Lamongan', '2025-12-06', 'SUMATERA BARAT, KABUPATEN AGAM, BASO, SIMARASOK', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 12:09:23'),
(130, 'Aldaka Triyanti A B', NULL, 21, 'pr', 'aaa', 'indo', 'Lamongan', '2025-12-06', 'SUMATERA BARAT, KABUPATEN AGAM, BASO, SIMARASOK', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 12:09:24'),
(131, 'Aldaka Triyanti A B', NULL, 21, 'pr', 'aaa', 'indo', 'Lamongan', '2025-12-06', 'SUMATERA BARAT, KABUPATEN AGAM, BASO, SIMARASOK', '082974865789', 'kerja', 'C', 'HM', 'ISLAM', '2025-12-05 12:09:24'),
(141, 'Sodiq', 'mad@gmail.com', 19, 'Laki-laki', 'Belum Menikah', 'Indonesia', 'ngawi', '2006-06-17', 'PANDANSARI SELATAN, SUKOHARJO, KABUPATEN PRINGSEWU, LAMPUNG', '03290382983', 'Korea', 'B', '', 'Katolik', '2025-12-16 18:56:41');

-- --------------------------------------------------------

--
-- Struktur dari tabel `member_foto`
--

CREATE TABLE `member_foto` (
  `foto_id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `member_foto`
--

INSERT INTO `member_foto` (`foto_id`, `member_id`, `foto`, `created_at`, `updated_at`) VALUES
(1, 141, '1766041477182-879849756', '2025-12-18 07:04:37', '2025-12-18 07:04:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `member_riwayat_pekerjaan`
--

CREATE TABLE `member_riwayat_pekerjaan` (
  `id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `perusahaan` varchar(150) DEFAULT NULL,
  `posisi` varchar(100) DEFAULT NULL,
  `tahun_masuk_kerja` varchar(10) DEFAULT NULL,
  `tahun_selesai_kerja` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `member_riwayat_pekerjaan`
--

INSERT INTO `member_riwayat_pekerjaan` (`id`, `member_id`, `perusahaan`, `posisi`, `tahun_masuk_kerja`, `tahun_selesai_kerja`) VALUES
(1, NULL, 'aa', 'aa', 'aa', 'aa'),
(2, NULL, 'aa', 'aa', 'aa', 'aa'),
(3, NULL, 'aa', 'aa', 'aa', 'aa'),
(4, NULL, 'aa', 'aa', 'aa', 'aa'),
(5, NULL, 'aa', 'aa', 'aa', 'aa'),
(6, NULL, 'aa', 'aa', 'aa', 'aa');

-- --------------------------------------------------------

--
-- Struktur dari tabel `member_riwayat_pendidikan`
--

CREATE TABLE `member_riwayat_pendidikan` (
  `id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `nama_smp` varchar(150) DEFAULT NULL,
  `tahun_masuk_smp` varchar(10) DEFAULT NULL,
  `tahun_lulus_smp` varchar(10) DEFAULT NULL,
  `nama_sma_smk` varchar(150) DEFAULT NULL,
  `tahun_masuk_sma_smk` varchar(10) DEFAULT NULL,
  `tahun_lulus_sma_smk` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `member_riwayat_pendidikan`
--

INSERT INTO `member_riwayat_pendidikan` (`id`, `member_id`, `nama_smp`, `tahun_masuk_smp`, `tahun_lulus_smp`, `nama_sma_smk`, `tahun_masuk_sma_smk`, `tahun_lulus_sma_smk`) VALUES
(21, NULL, 'fakmen', '2022', '2222', 'fakmen', '222', '222'),
(22, NULL, 'fakmen', '2022', '2222', 'fakmen', '222', '222'),
(23, NULL, 'aa', 'a', 'a', 'a', 'a', 'a'),
(27, 141, 'smp 1', '2020', '2023', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `mentor_pendidikan`
--

CREATE TABLE `mentor_pendidikan` (
  `id` int(11) NOT NULL,
  `mentor_profile_id` int(11) NOT NULL,
  `tingkat` enum('SMA','D3','S1','S2','S3','Lainnya') NOT NULL,
  `tingkat_lainnya` varchar(100) DEFAULT NULL,
  `jurusan` varchar(255) NOT NULL,
  `universitas` varchar(255) NOT NULL,
  `tahun_masuk` year(4) DEFAULT NULL,
  `tahun_lulus` year(4) NOT NULL,
  `ijazah_file` varchar(255) NOT NULL,
  `urutan` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `mentor_profiles`
--

CREATE TABLE `mentor_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `jenis_kelamin` enum('L','P') DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `bahasa_inggris` tinyint(1) DEFAULT 0,
  `bahasa_korea` tinyint(1) DEFAULT 0,
  `bahasa_jepang` tinyint(1) DEFAULT 0,
  `pengalaman_mengajar` text DEFAULT NULL,
  `alasan_menjadi_mentor` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `mentor_sertifikat`
--

CREATE TABLE `mentor_sertifikat` (
  `id` int(11) NOT NULL,
  `mentor_profile_id` int(11) NOT NULL,
  `nama_sertifikat` varchar(255) NOT NULL,
  `penerbit` varchar(255) NOT NULL,
  `tahun` year(4) NOT NULL,
  `file` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` int(11) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `program_id` int(11) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telp` varchar(20) DEFAULT NULL,
  `metode` varchar(50) DEFAULT NULL,
  `biaya` int(11) DEFAULT NULL,
  `status` enum('pending','settlement','cancel') NOT NULL DEFAULT 'pending',
  `snap_token` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pembayaran`
--

INSERT INTO `pembayaran` (`id`, `order_id`, `program_id`, `nama`, `email`, `telp`, `metode`, `biaya`, `status`, `snap_token`, `created_at`) VALUES
(4, 'ORDER-1765375196697-627', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 8000000, 'pending', '684bcc8f-3bcf-40c5-816b-e9701a5c5e92', '2025-12-10 13:59:56'),
(5, 'ORDER-1765375496374-593', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 8000000, 'pending', '273f9cfa-b3d7-4a21-971a-826173b1ccf9', '2025-12-10 14:04:56'),
(6, 'ORDER-1765375543308-935', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 8000000, 'pending', '5bfa5993-756a-4e6c-b2b1-82e239baec57', '2025-12-10 14:05:43'),
(7, 'ORDER-1765375719427-761', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 8000000, 'pending', '6f176049-5cd9-4f33-8a50-c30c48d13a4b', '2025-12-10 14:08:39'),
(8, 'ORDER-1765376373366-789', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 5000000, 'pending', 'a77d51e4-1e3b-49fd-b966-905e81498be2', '2025-12-10 14:19:33'),
(9, 'ORDER-1765376472741-398', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 5000000, 'pending', '333674fb-9adc-4230-b16d-c90a110b0c9e', '2025-12-10 14:21:12'),
(10, 'ORDER-1765376528945-417', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 5000000, 'pending', '825b8db8-86f1-47b5-b8b2-76e66d03b386', '2025-12-10 14:22:09'),
(11, 'ORDER-1765376643846-71', 1, 'ahmad', 'abc@gmail.com', '123455', NULL, 5000000, 'pending', '48ee7a5a-56a1-4b52-a425-a94fa378daf3', '2025-12-10 14:24:04'),
(12, 'ORDER-1765376670737-361', 1, 'ahmad', 'abc@gmail.com', '123455', NULL, 5000000, 'pending', '1f3c63bf-1460-4105-b50f-965e1823930f', '2025-12-10 14:24:30'),
(13, 'ORDER-1765376730938-536', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 5000000, 'pending', 'a482edcd-0602-4816-a43a-a2c1693ee124', '2025-12-10 14:25:31'),
(14, 'ORDER-1765376769223-533', 1, 'ahmad', 'abc@gmail.com', '123', NULL, 5000000, 'pending', '2de5c5df-f4d7-4105-98c0-3842f5ec00a0', '2025-12-10 14:26:09'),
(15, 'ORDER-1765376816037-686', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 5000000, 'pending', 'bf5de586-a8a1-461e-abb2-e19fb63e9f80', '2025-12-10 14:26:56'),
(16, 'ORDER-1765376815159-838', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 5000000, 'pending', '465816e3-0ef4-478d-b8b4-c3de558aa26c', '2025-12-10 14:26:56'),
(17, 'ORDER-1765376816869-850', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 5000000, 'pending', 'f43bfe8b-7074-4e42-a483-13a93e8a7cdc', '2025-12-10 14:26:57'),
(18, 'ORDER-1765376827692-354', 1, 'ahmad', 'abc@gmail.com', '123456', NULL, 5000000, 'pending', '1da0706b-f805-4638-b6e9-a2fb29692a56', '2025-12-10 14:27:07'),
(19, 'ORDER-1765377021596-777', 1, 'ahmad', 'abc@gmail.com', '123', NULL, 5000000, 'pending', '773fd174-cb5c-4ab5-8fa4-37844aa09c2d', '2025-12-10 14:30:21');

-- --------------------------------------------------------

--
-- Struktur dari tabel `program_daftar`
--

CREATE TABLE `program_daftar` (
  `id` int(11) NOT NULL,
  `program` varchar(50) DEFAULT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telp` varchar(20) DEFAULT NULL,
  `metode` varchar(50) DEFAULT NULL,
  `order_id` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'UNPAID',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `program_daftar`
--

INSERT INTO `program_daftar` (`id`, `program`, `nama`, `email`, `telp`, `metode`, `order_id`, `status`, `created_at`) VALUES
(3, 'Jepang', 'Aldaka Triyanti Agustina Basuki', '2211102071@ittelkom-pwt.ac.id', '12345678', 'Transfer Bank', NULL, 'UNPAID', '2025-12-05 14:16:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `program_kelas`
--

CREATE TABLE `program_kelas` (
  `id` int(11) NOT NULL,
  `nama_program` varchar(255) DEFAULT NULL,
  `kapasitas` int(11) DEFAULT NULL,
  `terdaftar` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','mentor','member') DEFAULT 'member',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(2, 'admin', 'admin@gmail.com', '$2a$10$eSzzDlSCfKQ6TmZ3dfbWMOTf.0GmUMUG4r74aMoQPH97Ge1V8LhEG', 'admin', '2025-11-11 11:18:21'),
(3, 'mentor', 'mentor@gmail.com', '$2b$10$hq0HEJmz835OOFzwPzxv6ebkLvhDLM.7DOascyLx/e.2llOPRThjq', 'mentor', '2025-11-11 11:19:37'),
(4, 'member', 'member@gmail.com', '$2b$10$S2LoLcfTQApZnrnejZOF2OqPplNl.DwScmI6.JpCYWrQIbrnsAtVO', 'member', '2025-11-11 11:20:19'),
(5, 'Sodiq', 'mad@gmail.com', '$2a$10$rLkNW2xwxbVIS9YnLyv0d.NNPz7ejmaTl9AeynkBNjUJT0JwK3Cly', 'member', '2025-12-16 18:56:50');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentor_id` (`mentor_id`);

--
-- Indeks untuk tabel `galeri`
--
ALTER TABLE `galeri`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kontak`
--
ALTER TABLE `kontak`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `member_data_diri`
--
ALTER TABLE `member_data_diri`
  ADD PRIMARY KEY (`member_id`);

--
-- Indeks untuk tabel `member_foto`
--
ALTER TABLE `member_foto`
  ADD PRIMARY KEY (`foto_id`),
  ADD KEY `idx_member_id` (`member_id`);

--
-- Indeks untuk tabel `member_riwayat_pekerjaan`
--
ALTER TABLE `member_riwayat_pekerjaan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indeks untuk tabel `member_riwayat_pendidikan`
--
ALTER TABLE `member_riwayat_pendidikan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indeks untuk tabel `mentor_pendidikan`
--
ALTER TABLE `mentor_pendidikan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mentor_profile_id` (`mentor_profile_id`);

--
-- Indeks untuk tabel `mentor_profiles`
--
ALTER TABLE `mentor_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indeks untuk tabel `mentor_sertifikat`
--
ALTER TABLE `mentor_sertifikat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mentor_profile_id` (`mentor_profile_id`);

--
-- Indeks untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `program_daftar`
--
ALTER TABLE `program_daftar`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `program_kelas`
--
ALTER TABLE `program_kelas`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `berita`
--
ALTER TABLE `berita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT untuk tabel `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `galeri`
--
ALTER TABLE `galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT untuk tabel `kontak`
--
ALTER TABLE `kontak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `member_data_diri`
--
ALTER TABLE `member_data_diri`
  MODIFY `member_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT untuk tabel `member_foto`
--
ALTER TABLE `member_foto`
  MODIFY `foto_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `member_riwayat_pekerjaan`
--
ALTER TABLE `member_riwayat_pekerjaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `member_riwayat_pendidikan`
--
ALTER TABLE `member_riwayat_pendidikan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT untuk tabel `mentor_pendidikan`
--
ALTER TABLE `mentor_pendidikan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `mentor_profiles`
--
ALTER TABLE `mentor_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `mentor_sertifikat`
--
ALTER TABLE `mentor_sertifikat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT untuk tabel `program_daftar`
--
ALTER TABLE `program_daftar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `program_kelas`
--
ALTER TABLE `program_kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`);

--
-- Ketidakleluasaan untuk tabel `member_foto`
--
ALTER TABLE `member_foto`
  ADD CONSTRAINT `fk_member_foto_member_id` FOREIGN KEY (`member_id`) REFERENCES `member_data_diri` (`member_id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `member_riwayat_pekerjaan`
--
ALTER TABLE `member_riwayat_pekerjaan`
  ADD CONSTRAINT `member_riwayat_pekerjaan_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member_data_diri` (`member_id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `member_riwayat_pendidikan`
--
ALTER TABLE `member_riwayat_pendidikan`
  ADD CONSTRAINT `member_riwayat_pendidikan_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member_data_diri` (`member_id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `mentor_pendidikan`
--
ALTER TABLE `mentor_pendidikan`
  ADD CONSTRAINT `mentor_pendidikan_ibfk_1` FOREIGN KEY (`mentor_profile_id`) REFERENCES `mentor_profiles` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `mentor_profiles`
--
ALTER TABLE `mentor_profiles`
  ADD CONSTRAINT `mentor_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `mentor_sertifikat`
--
ALTER TABLE `mentor_sertifikat`
  ADD CONSTRAINT `mentor_sertifikat_ibfk_1` FOREIGN KEY (`mentor_profile_id`) REFERENCES `mentor_profiles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
