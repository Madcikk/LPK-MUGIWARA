import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings, FiAward, FiLogOut } from "react-icons/fi";
import logo from "./components/aset/logo.png";

const BASEURL = "http://localhost:5000";

export default function MemberAchievements() {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    nama: "Akun Member",
    email: "",
    foto: "https://via.placeholder.com/150",
  });
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]); // Array kosong karena belum ada capaian

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const nameFromStorage = localStorage.getItem("name");
        
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
        } else {
          setMember({
            nama: nameFromStorage || "Member",
            email: localStorage.getItem("email") || "",
            foto: "https://via.placeholder.com/150",
          });
        }

        // TODO: Fetch achievements dari API
        // const achievementsResponse = await fetch(`${BASEURL}/api/member/achievements`, {
        //   headers: { "Authorization": `Bearer ${token}` }
        // });
        // if (achievementsResponse.ok) {
        //   const achievementsData = await achievementsResponse.json();
        //   setAchievements(achievementsData);
        // }
      } catch (err) {
        console.error("Error fetching data:", err);
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
            className="text-gray-700 hover:text-[#00A5CF] font-medium transition-colors duration-200 relative group"
          >
            Beranda
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00A5CF] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/member/dashboard" 
            className="text-[#00A5CF] font-medium transition-colors duration-200 relative group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00A5CF]"></span>
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
              src={member.foto ? member.foto : `https://ui-avatars.com/api/?name=${member.name}&background=random`}
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
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Dashboard Capaian Belajar
              </h1>
              <p className="text-gray-600 text-lg">Lihat progress dan pencapaian pembelajaran Anda</p>
            </div>

            {/* Empty State */}
            {achievements.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 md:p-16 flex flex-col items-center justify-center min-h-[500px]">
                <svg
                  className="w-64 h-64 md:w-80 md:h-80 text-gray-300 mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Belum Ada Capaian Belajar
                </h2>
                <p className="text-gray-600 text-center max-w-md mb-8">
                  Anda belum memiliki capaian belajar yang selesai. Mulai langganan kelas dan selesaikan pembelajaran untuk melihat capaian Anda di sini.
                </p>
                <Link
                  to="/member"
                  className="px-8 py-3 bg-gradient-to-r from-[#00A5CF] to-[#0096D6] hover:from-[#0096D6] hover:to-[#00A5CF] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Lihat Paket Belajar
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Achievement cards akan ditampilkan di sini */}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

