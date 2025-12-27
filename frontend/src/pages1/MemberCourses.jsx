import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings, FiLogOut } from "react-icons/fi";
import logo from "./components/aset/logo.png";

const BASEURL = "http://localhost:5000";

export default function MemberCourses() {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    nama: "Akun Member",
    email: "",
    foto: "https://via.placeholder.com/150",
  });
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]); // Array kosong karena belum ada langganan

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

        // TODO: Fetch courses dari API
        // const coursesResponse = await fetch(`${BASEURL}/api/member/courses`, {
        //   headers: { "Authorization": `Bearer ${token}` }
        // });
        // if (coursesResponse.ok) {
        //   const coursesData = await coursesResponse.json();
        //   setCourses(coursesData);
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
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
    } catch (e) {
      console.warn('Error clearing storage during logout', e);
    }
    navigate('/login');
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
            className="text-gray-700 hover:text-[#00A5CF] font-medium transition-colors duration-200 relative group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00A5CF] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/member/courses" 
            className="text-[#00A5CF] font-medium transition-colors duration-200 relative group"
          >
            Courses
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00A5CF]"></span>
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
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                My Courses
              </h1>
              <p className="text-gray-600 text-lg">Kelas yang sedang Anda ikuti</p>
            </div>

            {/* Empty State */}
            {courses.length === 0 ? (
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  Belum Ada Kelas
                </h2>
                <p className="text-gray-600 text-center max-w-md mb-8">
                  Anda belum memiliki kelas yang sedang diikuti. Mulai langganan kelas untuk memulai pembelajaran Anda.
                </p>
                <Link
                  to="/program"
                  className="px-8 py-3 bg-gradient-to-r from-[#00A5CF] to-[#0096D6] hover:from-[#0096D6] hover:to-[#00A5CF] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Lihat Program Tersedia
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Course cards akan ditampilkan di sini */}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

