import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings, FiBookOpen, FiAward, FiBell, FiLogOut } from "react-icons/fi";
import jepangImg from "../assets/jepang.jpg";
import koreaImg from "../assets/korea.jpg";
import eropaImg from "../assets/eropa.jpg";
import logo from "./components/aset/logo.png";

const BASEURL = "http://localhost:5000";

export default function MemberDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    nama: "Akun Member",
    email: "",
    foto: "https://via.placeholder.com/150",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Coba ambil dari localStorage dulu (dari login)
        const nameFromStorage = localStorage.getItem("name");
        
        // Fetch data lengkap dari API
        const response = await fetch(`${BASEURL}/register/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMember({
            nama: data.nama || data.name || nameFromStorage || "Member",
            email: data.email || "",
            foto: data.foto ? `${BASEURL}/uploads/${data.foto}` : "https://via.placeholder.com/150",
          });
          // Update localStorage dengan data terbaru
          if (data.nama || data.name) {
            localStorage.setItem("name", data.nama || data.name);
          }
          if (data.email) {
            localStorage.setItem("email", data.email);
          }
        } else {
          // Jika API gagal, gunakan data dari localStorage
          setMember({
            nama: nameFromStorage || "Member",
            email: localStorage.getItem("email") || "",
            foto: "https://via.placeholder.com/150",
          });
        }
      } catch (err) {
        console.error("Error fetching member data:", err);
        // Fallback ke localStorage
        const nameFromStorage = localStorage.getItem("name");
        setMember({
          nama: nameFromStorage || "Member",
          email: localStorage.getItem("email") || "",
          foto: "https://via.placeholder.com/150",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
    
    // Refresh data saat window mendapat focus (misalnya kembali dari tab lain)
    const handleFocus = () => {
      fetchMemberData();
    };
    window.addEventListener("focus", handleFocus);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [navigate]);

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR */}
      <header className="w-full bg-white shadow-sm py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Mugiwara" className="h-16 md:h-20 w-auto" />
        </Link>

        {/* Menu Navigation */}
        <nav className="hidden md:flex items-center gap-6 ml-8">
          <Link 
            to="/member" 
            className="text-[#00A5CF] font-medium transition-colors duration-200 relative group"
          >
            Beranda
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00A5CF]"></span>
          </Link>
          <Link 
            to="/member/dashboard" 
            className="text-gray-700 hover:text-[#00A5CF] font-medium transition-colors duration-200 relative group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00A5CF] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/member/courses" 
            className="text-gray-700 hover:text-[#00A5CF] font-medium transition-colors duration-200 relative group"
          >
            Courses
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00A5CF] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* User Name & Avatar */}
          <div className="flex items-center gap-3">
            <img
              src={member.foto}
              alt="Foto Member"
              className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
            />
            <div className="hidden md:block">
              <p className="font-semibold text-gray-700 text-sm">{member.nama}</p>
            </div>
          </div>

          {/* Settings Icon */}
          <Link
            to="/member/settings"
            className="p-2 text-gray-600 hover:text-[#00A5CF] hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Settings"
          >
            <FiSettings className="w-5 h-5" />
          </Link>

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Logout"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-gray-50 to-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A5CF]"></div>
          </div>
        ) : (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Selamat Datang, <span className="text-[#00A5CF]">{member.nama}</span>
              </h2>
              <p className="text-gray-600 text-lg">Temukan paket belajar terbaik untuk Anda.</p>
            </div>

            {/* ====== 3 CARD STATUS MEMBER ====== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Program Diikuti Card */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FiBookOpen className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">Kosong</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Program Diikuti</h3>
                  <p className="text-4xl font-bold text-gray-900 mb-1">0</p>
                  <p className="text-xs text-gray-500">Total program aktif saat ini</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
              </div>

              {/* Sertifikat Card */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FiAward className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">Kosong</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Sertifikat</h3>
                  <p className="text-4xl font-bold text-gray-900 mb-1">0</p>
                  <p className="text-xs text-gray-500">Program yang sudah selesai</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
              </div>

              {/* Notifikasi Card */}
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FiBell className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full">Kosong</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Notifikasi</h3>
                  <p className="text-4xl font-bold text-gray-900 mb-1">0</p>
                  <p className="text-xs text-gray-500">Informasi terbaru untuk Anda</p>
                </div>
                <div className="h-1 bg-gradient-to-r from-gray-300 to-gray-400"></div>
              </div>
            </div>

            {/* ===== PROGRAM SECTION ===== */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Rekomendasi Program</h2>
                  <p className="text-gray-600 mt-1">Program pelatihan terbaik untuk Anda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Program Jepang */}
                <Link
                  to="/detail_program/jepang_deskripsi"
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={jepangImg} 
                      alt="Jepang" 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Jepang</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Tersedia</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#00A5CF] transition-colors">
                      Pelatihan Jepang
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Bahasa Jepang, budaya kerja, persiapan magang & kerja luar negeri.
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-[#00A5CF] group-hover:gap-2 flex items-center gap-1 transition-all">
                        Lihat Detail
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Program Korea */}
                <Link
                  to="/detail_program/korea_deskripsi"
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={koreaImg} 
                      alt="Korea" 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Korea</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Tersedia</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#00A5CF] transition-colors">
                      Pelatihan Korea
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      EPS-Topik, bahasa Korea, budaya kerja, persiapan seleksi.
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-[#00A5CF] group-hover:gap-2 flex items-center gap-1 transition-all">
                        Lihat Detail
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Program Eropa */}
                <Link
                  to="/detail_program/eropa_deskripsi"
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={eropaImg} 
                      alt="Eropa" 
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Eropa</span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Tersedia</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#00A5CF] transition-colors">
                      Pelatihan Eropa
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      Bahasa Inggris, training hospitality, persiapan kerja Eropa.
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-[#00A5CF] group-hover:gap-2 flex items-center gap-1 transition-all">
                        Lihat Detail
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

          </>
        )}
      </main>
    </div>
  );
}
