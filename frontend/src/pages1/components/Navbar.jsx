import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "./aset/logo.png";
import bg from "./aset/bg.jpg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [progOpen, setProgOpen] = useState(false);
  const [navBg, setNavBg] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // === DETEKSI HALAMAN DENGAN BACKGROUND PUTIH ===
  const isWhiteBackgroundPage = location.pathname.startsWith("/berita") || 
                                 location.pathname.startsWith("/galeri") ||
                                 location.pathname.startsWith("/kontak") ||
                                 location.pathname.startsWith("/program") ||
                                 location.pathname.startsWith("/admin") ||
                                 location.pathname.startsWith("/member") ||
                                 location.pathname.startsWith("/login") ||
                                 location.pathname.startsWith("/register");

  // === UBAH WARNA SAAT SCROLL ===
  useEffect(() => {
    // Jika di halaman dengan background putih, langsung set navBg true
    if (isWhiteBackgroundPage) {
      setNavBg(true);
      return;
    }

    // Reset navBg saat pindah ke halaman dengan background gelap
    setNavBg(false);

    const handleScroll = () => {
      if (window.scrollY > 50) setNavBg(true);
      else setNavBg(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isWhiteBackgroundPage]);

  // === TUTUP DROPDOWN SAAT KLIK DI LUAR ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProgOpen(false);
      }
    };

    if (progOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [progOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300
        ${navBg ? "bg-white shadow-md text-gray-900" : "bg-transparent text-white"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-40">
          <img src={logo} alt="Mugiwara" className="h-20 w-auto" />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className="relative group transition-all duration-300"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProgOpen(s => !s)}
              className="relative group transition-all duration-300 flex items-center gap-2"
            >
              Program
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${progOpen ? 'rotate-180' : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {progOpen && (
              <div
                className={`absolute mt-1 w-56 rounded-lg shadow-lg overflow-hidden transition-all duration-300
                ${navBg ? "bg-white text-gray-800" : "bg-white text-gray-800"}`}
              >
                <Link to="/program_jepang" className="block px-4 py-2 transition-all duration-200 hover:text-[#00A5CF] hover:bg-blue-50 hover:pl-6">Kelas Bahasa Jepang</Link>
                <Link to="/program_korea" className="block px-4 py-2 transition-all duration-200 hover:text-[#00A5CF] hover:bg-blue-50 hover:pl-6">Kelas Bahasa Korea</Link>
                <Link to="/program_eropa" className="block px-4 py-2 transition-all duration-200 hover:text-[#00A5CF] hover:bg-blue-50 hover:pl-6">Program Ke Eropa</Link>
              </div>
            )}
          </div>

          <Link 
            to="/galeri" 
            className="relative group transition-all duration-300"
          >
            Galeri
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/berita" 
            className="relative group transition-all duration-300"
          >
            Berita
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/kontak" 
            className="relative group transition-all duration-300"
          >
            Kontak
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/login" 
            className="relative group transition-all duration-300"
          >
            Login
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Mobile burger */}
        <div className="md:hidden z-40">
          <button
            onClick={() => setOpen(s => !s)}
            className="p-2 rounded-md bg-black/30"
            aria-label="menu"
          >
            {open ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div
          className={`md:hidden backdrop-blur-sm transition-all
          ${navBg ? "bg-gray-900/90 text-white" : "bg-black/50 text-white"}`}
        >
          <div className="px-6 py-4 flex flex-col gap-3">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>

            <div>
              <button
                onClick={() => setProgOpen(s => !s)}
                className="w-full text-left flex items-center justify-between"
              >
                Program
                <span>{progOpen ? "-" : "+"}</span>
              </button>

              {progOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2">
                  <Link to="/program_jepang" onClick={() => setOpen(false)}>Program Jepang</Link>
                  <Link to="/program_korea" onClick={() => setOpen(false)}>Program Korea</Link>
                </div>
              )}
            </div>

            <Link to="/galeri" onClick={() => setOpen(false)}>Galeri</Link>
            <Link to="/berita" onClick={() => setOpen(false)}>Berita</Link>
            <Link to="/kontak" onClick={() => setOpen(false)}>Kontak</Link>
          </div>
        </div>
      )}
    </header>
  );
}
