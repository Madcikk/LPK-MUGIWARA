import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Import gambar berita dari assets
import berita1 from "../assets/berita1.jpeg";
import berita2 from "../assets/berita2.jpeg";
import berita3 from "../assets/berita3.jpeg";

const BASEURL = "http://localhost:5000";

const beritaImages = [berita1, berita2, berita3];

export default function DetailBerita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [berita, setBerita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  
  // Cek apakah user adalah admin
  const isAdmin = localStorage.getItem("role") === "admin";
  
  // Fungsi untuk handle kembali
  const handleBack = () => {
    if (isAdmin) {
      // Jika admin, redirect ke admin dashboard dengan menu berita aktif
      navigate("/admin", { state: { activeMenu: "berita" } });
    } else {
      // Jika bukan admin, redirect ke halaman berita publik
      navigate("/berita");
    }
  };

  useEffect(() => {
    // Fetch single berita by ID untuk performa lebih baik
    axios
      .get(`${BASEURL}/api/berita/${id}`)
      .then((res) => {
        setBerita(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch berita:", err);
        // Jika endpoint single tidak tersedia, fallback ke fetch all
        if (err.response?.status === 404) {
          axios
            .get(`${BASEURL}/api/berita`)
            .then((res) => {
              const found = res.data.find((item) => item.id === parseInt(id));
              if (found) {
                setBerita(found);
              }
              setLoading(false);
            })
            .catch((fallbackErr) => {
              console.error("Gagal fetch berita (fallback):", fallbackErr);
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
  }, [id]);

  // Tutup modal saat tekan ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setImageModalOpen(false);
      }
    };
    if (imageModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [imageModalOpen]);

  const getImage = (index) => {
    return beritaImages[index % beritaImages.length];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate deskripsi berdasarkan konten berita
  const getDescription = () => {
    if (berita?.content) {
      const firstParagraph = berita.content.split('\n').find(p => p.trim().length > 50);
      if (firstParagraph) {
        return firstParagraph.trim().slice(0, 200) + (firstParagraph.length > 200 ? '...' : '');
      }
    }
    return "Berita terbaru dari LPK Mugiwara tentang program pelatihan dan kegiatan terkini. Dapatkan informasi lengkap seputar pelatihan bahasa, persiapan bekerja di luar negeri, dan berbagai program menarik lainnya.";
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A5CF] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat berita...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="bg-white min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Berita tidak ditemukan</h2>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-[#00A5CF] text-white rounded-lg hover:bg-[#0096D6] transition-colors duration-300"
            >
              {isAdmin ? "Kembali ke Kelola Berita" : "Kembali ke Berita"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ICON BACK - Di sisi kiri */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-8 pb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-[#00A5CF] transition-colors duration-300 group"
          aria-label={isAdmin ? "Kembali ke kelola berita" : "Kembali ke daftar berita"}
        >
          <svg 
            className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Kembali</span>
        </button>
      </div>

      {/* GAMBAR UTAMA - Di paling atas */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mb-8">
        <div 
          className="relative w-full h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => setImageModalOpen(true)}
        >
          <img
            src={berita.image ? `${BASEURL}${berita.image}` : getImage(parseInt(id) % beritaImages.length)}
            alt={berita.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback ke gambar default jika error
              e.target.src = getImage(parseInt(id) % beritaImages.length);
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </div>
          <p className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
            Klik untuk memperbesar
          </p>
        </div>
      </div>

      {/* INFORMASI & DESKRIPSI - Di bawah gambar dengan garis pemisah */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-24 md:pb-32">
        <div className="grid md:grid-cols-3 gap-8 border-t border-gray-200 pt-8">
          {/* JUDUL & DESKRIPSI - Sebelah kiri */}
          <div className="md:col-span-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
              {berita.title}
            </h1>
            
            {/* Deskripsi - Menggunakan konten berita yang sebenarnya */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                {berita.content || getDescription()}
              </div>
            </div>
          </div>

          {/* INFO BERITA - Sebelah kanan */}
          <div className="md:col-span-1">
            <div className="border-l border-gray-200 pl-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
                Informasi Berita
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Kategori</p>
                  <span className="px-3 py-1.5 bg-[#00A5CF] text-white text-sm font-semibold rounded-full inline-block">
                    Berita
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Tanggal Publikasi</p>
                  <time className="text-sm text-gray-900 font-medium block" dateTime={berita.created_at || new Date().toISOString()}>
                    {formatDate(berita.created_at) || new Date().toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Diunggah oleh</p>
                  <p className="text-sm text-gray-900 font-medium">
                    Admin LPK Mugiwara
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KONTEN BERITA LENGKAP - Ditampilkan jika ada konten tambahan */}
      {berita.content && berita.content.length > 200 && (
        <article className="max-w-4xl mx-auto px-6 md:px-8 pb-16">
          <div className="border-t border-gray-200 pt-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base md:text-lg space-y-6 break-words overflow-wrap-anywhere">
                {berita.content.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-6 break-words">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
          </div>
        </article>
      )}

      {/* CALL TO ACTION - Full width kiri-kanan, hanya 1 button */}
      <div className="w-full bg-blue-700 py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center text-white">
          <div className="flex justify-center">
            <a
              href="https://wa.me/6282341998356"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-green-600 px-6 py-3 rounded-full shadow-lg font-bold hover:bg-gray-100 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="wa"
                className="w-7 h-7"
              />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* MODAL LIGHTBOX - Gambar full size dengan overlay blur gelap */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          {/* Overlay blur gelap */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
          
          {/* Icon Close (Silang) */}
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors duration-300 bg-black/50 rounded-full p-2 backdrop-blur-sm"
            aria-label="Tutup"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Gambar Full Size */}
          <div className="relative z-40 max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={berita.image ? `${BASEURL}${berita.image}` : getImage(parseInt(id) % beritaImages.length)}
              alt={berita.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                // Fallback ke gambar default jika error
                e.target.src = getImage(parseInt(id) % beritaImages.length);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
