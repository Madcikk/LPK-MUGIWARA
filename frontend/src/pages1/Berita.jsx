import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import axios from "axios";

// Import gambar berita dari assets
import berita1 from "../assets/berita1.jpeg";
import berita2 from "../assets/berita2.jpeg";
import berita3 from "../assets/berita3.jpeg";

const BASEURL = "http://localhost:5000";

// Array gambar berita
const beritaImages = [berita1, berita2, berita3];

export default function Berita() {
  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASEURL}/api/berita`)
      .then((res) => {
        setBerita(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal fetch berita:", err);
        setLoading(false);
      });
  }, []);

  // Fungsi untuk mendapatkan gambar berdasarkan index
  const getImage = (index) => {
    return beritaImages[index % beritaImages.length];
  };

  const handleCardClick = (id) => {
    navigate(`/berita/${id}`);
  };

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* HEADER SECTION - Minimalis dengan padding-top untuk navbar */}
      <section className="border-b border-gray-200 bg-white pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Berita & Informasi
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dapatkan informasi terbaru seputar program, kegiatan, dan aktivitas LPK Mugiwara.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A5CF] mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat berita...</p>
            </div>
          </div>
        ) : berita.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada berita tersedia</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {berita.map((item, index) => (
              <article
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100 transform hover:-translate-y-1"
              >
                {/* GAMBAR BERITA - Diatur di tengah dan hampir terlihat utuh */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={item.image ? `${BASEURL}${item.image}` : getImage(index)}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: "center center" }}
                    onError={(e) => {
                      // Fallback ke gambar default jika error
                      e.target.src = getImage(index);
                    }}
                  />
                  {/* Gradient overlay untuk efek lebih menarik */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-[#00A5CF] text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                      Berita
                    </span>
                  </div>
                </div>

                {/* CONTENT CARD */}
                <div className="p-6">
                  {/* DATE */}
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {formatDate(item.created_at) || "Baru"}
                    </time>
                  </div>

                  {/* TITLE */}
                  <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-[#00A5CF] transition-colors duration-300 mb-3">
                    {item.title}
                  </h2>

                  {/* EXCERPT */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                    {item.content?.replace(/\n/g, " ").slice(0, 150)}...
                  </p>

                  {/* READ MORE */}
                  <div className="flex items-center text-[#00A5CF] font-semibold text-sm mt-6 pt-4 border-t border-gray-100 group-hover:border-[#00A5CF]/30 transition-colors duration-300">
                    <span>Baca selengkapnya</span>
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
