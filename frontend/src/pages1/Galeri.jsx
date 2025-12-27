import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";

const BASEURL = "http://localhost:5000";

export default function Galeri() {
  const [galeri, setGaleri] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    fetchGaleri();
  }, []);

  // Tutup lightbox saat tekan ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    if (lightboxOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [lightboxOpen]);

  const fetchGaleri = async () => {
    try {
      const res = await axios.get(`${BASEURL}/api/galeri`);
      setGaleri(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Gagal fetch galeri:", err);
      setLoading(false);
    }
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    const currentIndex = galeri.findIndex((img) => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === "next") {
      newIndex = (currentIndex + 1) % galeri.length;
    } else {
      newIndex = currentIndex - 1 < 0 ? galeri.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(galeri[newIndex]);
  };

  // Generate random heights untuk efek dinamis
  const getRandomHeight = (index) => {
    const heights = [250, 300, 350, 400, 280, 320, 380];
    return heights[index % heights.length];
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* HEADER SECTION */}
      <section className="border-b border-gray-200 bg-white pt-24 md:pt-28">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Galeri Kegiatan
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dokumentasi kegiatan program dan aktivitas peserta LPK Mugiwara.
            </p>
          </div>
        </div>
      </section>

      {/* GALERI MASONRY LAYOUT */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A5CF] mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat galeri...</p>
            </div>
          </div>
        ) : galeri.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Belum ada foto galeri tersedia</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {galeri.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(item)}
                className="break-inside-avoid mb-4 group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <img
                    src={`${BASEURL}${item.image}`}
                    alt={item.caption || "Galeri"}
                    className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ minHeight: `${getRandomHeight(index)}px` }}
                    loading="lazy"
                  />
                  {/* Overlay dengan caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-sm font-medium line-clamp-2">
                        {item.caption || "Galeri Kegiatan"}
                      </p>
                    </div>
                  </div>
                  {/* Icon zoom indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Overlay blur gelap */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>

          {/* Icon Close (Silang) */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors duration-300 bg-black/50 rounded-full p-3 backdrop-blur-sm"
            aria-label="Tutup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Arrows */}
          {galeri.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("prev");
                }}
                className="absolute left-4 z-50 text-white hover:text-gray-300 transition-colors duration-300 bg-black/50 rounded-full p-3 backdrop-blur-sm"
                aria-label="Gambar sebelumnya"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage("next");
                }}
                className="absolute right-4 z-50 text-white hover:text-gray-300 transition-colors duration-300 bg-black/50 rounded-full p-3 backdrop-blur-sm"
                aria-label="Gambar berikutnya"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Gambar Full Size */}
          <div className="relative z-40 max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <img
              src={`${BASEURL}${selectedImage.image}`}
              alt={selectedImage.caption || "Galeri"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Caption */}
            {selectedImage.caption && (
              <div className="mt-4 text-center text-white max-w-2xl">
                <p className="text-lg font-medium">{selectedImage.caption}</p>
                {galeri.length > 1 && (
                  <p className="text-sm text-white/70 mt-2">
                    {galeri.findIndex((img) => img.id === selectedImage.id) + 1} / {galeri.length}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
