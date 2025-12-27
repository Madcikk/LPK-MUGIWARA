import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSettings, FiLayout, FiFileText, FiImage, FiDollarSign, FiUsers, FiDownload, FiFilter, FiEye, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import logo from "./components/aset/logo.png";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  
  // Cek jika ada state dari navigate (untuk redirect dari detail berita)
  useEffect(() => {
    if (location.state?.activeMenu) {
      setActiveMenu(location.state.activeMenu);
    }
  }, [location.state]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const token = localStorage.getItem("token");
  const adminName = localStorage.getItem("name") || "Admin";

  const BASEURL = "http://localhost:5000";

  const [berita, setBerita] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [kontak, setKontak] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // Filter state untuk keuangan
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  
  // Modal state untuk detail user
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mentorProfile, setMentorProfile] = useState(null);
  const [loadingMentorProfile, setLoadingMentorProfile] = useState(false);
  
  // Modal state untuk detail berita
  const [showBeritaDetail, setShowBeritaDetail] = useState(false);
  const [selectedBerita, setSelectedBerita] = useState(null);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form berita
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [editingBerita, setEditingBerita] = useState(null);

  // Form galeri
  const [fotoGaleri, setFotoGaleri] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Modal state untuk detail galeri
  const [showGaleriDetail, setShowGaleriDetail] = useState(false);
  const [selectedGaleri, setSelectedGaleri] = useState(null);

  useEffect(() => {
    if (activeMenu === "dashboard" || activeMenu === "berita") {
    fetchBerita();
    }
    if (activeMenu === "dashboard" || activeMenu === "galeri") {
    fetchGaleri();
    }
    if (activeMenu === "dashboard") {
    fetchKontak();
    }
    if (activeMenu === "dashboard" || activeMenu === "user") {
      console.log("Calling fetchUsers for menu:", activeMenu);
      fetchUsers();
    }
    if (activeMenu === "dashboard" || activeMenu === "keuangan") {
      fetchPayments();
    }
  }, [activeMenu]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchBerita = async () => {
    try {
      const res = await fetch(`${BASEURL}/api/berita`);
      const data = await res.json();
      setBerita(data);
    } catch (err) {
      console.error("Gagal fetch berita:", err);
    }
  };

  const fetchGaleri = async () => {
    try {
      const res = await fetch(`${BASEURL}/api/galeri`);
      const data = await res.json();
      setGaleri(data);
    } catch (err) {
      console.error("Gagal fetch galeri:", err);
    }
  };

  const fetchKontak = async () => {
    try {
      const res = await fetch(`${BASEURL}/api/kontak`);
      const data = await res.json();
      setKontak(data);
    } catch (err) {
      console.error("Gagal fetch kontak:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log("=== Fetching users ===");
      console.log("Token:", token ? "Token exists" : "No token");
      console.log("URL:", `${BASEURL}/api/users`);
      
      const res = await fetch(`${BASEURL}/api/users`, {
        headers: { 
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
      });
      
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Users fetched from API:", data);
        console.log("Number of users:", data.length);
        
        // Filter out admin users (double check)
        const filteredUsers = data.filter(user => {
          const role = user.role ? user.role.toLowerCase().trim() : null;
          return role !== "admin";
        });
        
        console.log("Filtered users (excluding admin):", filteredUsers);
        console.log("Number of filtered users:", filteredUsers.length);
        setUsers(filteredUsers);
      } else {
        const errorText = await res.text();
        console.error("Error response:", res.status, errorText);
        setUsers([]);
      }
    } catch (err) {
      console.error("Gagal fetch users:", err);
      console.error("Error details:", err.message);
      setUsers([]);
    }
  };

  const fetchPayments = async () => {
    try {
      console.log("=== Fetching payments ===");
      const res = await fetch(`${BASEURL}/api/payment`, {
        headers: { Authorization: "Bearer " + token },
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Payments fetched from API:", data);
        console.log("Number of payments:", data.length);
        setPayments(data);
      } else {
        const errorText = await res.text();
        console.error("Error response:", res.status, errorText);
        setPayments([]);
      }
    } catch (err) {
      console.error("Gagal fetch payments:", err);
      console.error("Error details:", err.message);
      setPayments([]);
    }
  };

  // ===============================
  // CREATE BERITA
// ===============================
const createBerita = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Judul dan isi berita wajib diisi!");
      return;
    }

  const fd = new FormData();
  fd.append("title", title);
  fd.append("content", content);
    if (image) {
  fd.append("image", image);
    }

  try {
    const res = await fetch(`${BASEURL}/api/berita`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: fd,
    });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Upload gagal");
      }

    setTitle("");
    setContent("");
    setImage(null);
    fetchBerita();
      alert("Berita berhasil ditambahkan!");
  } catch (err) {
    console.error(err);
      alert("Gagal upload berita: " + err.message);
    }
  };

  // ===============================
  // UPDATE BERITA
  // ===============================
  const updateBerita = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Judul dan isi berita wajib diisi!");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    if (image) {
      fd.append("image", image);
    }

    try {
      const res = await fetch(`${BASEURL}/api/berita/${editingBerita.id}`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
        body: fd,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Update gagal");
      }

      setTitle("");
      setContent("");
      setImage(null);
      setEditingBerita(null);
      fetchBerita();
      alert("Berita berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui berita: " + err.message);
    }
  };

  // ===============================
  // EDIT BERITA
  // ===============================
  const handleEditBerita = (berita) => {
    setEditingBerita(berita);
    setTitle(berita.title);
    setContent(berita.content);
    setImage(null); // Reset image, user bisa upload baru atau tetap pakai yang lama
    // Scroll ke form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===============================
  // CANCEL EDIT
  // ===============================
  const handleCancelEdit = () => {
    setEditingBerita(null);
    setTitle("");
    setContent("");
    setImage(null);
  };

  // ===============================
  // CREATE GALERI (Multiple Files)
  // ===============================
  const createGaleri = async () => {
    if (fotoGaleri.length === 0) {
      alert("Pilih minimal satu foto!");
      return;
    }

    if (!caption.trim()) {
      alert("Caption wajib diisi!");
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Upload setiap file secara sequential
      for (let i = 0; i < fotoGaleri.length; i++) {
  const fd = new FormData();
  fd.append("caption", caption);
        fd.append("image", fotoGaleri[i]);

  try {
    const res = await fetch(`${BASEURL}/api/galeri`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

          if (res.ok) {
            successCount++;
          } else {
            failCount++;
            console.error(`Gagal upload foto ${i + 1}`);
          }
        } catch (err) {
          failCount++;
          console.error(`Error uploading foto ${i + 1}:`, err);
        }
      }

      // Reset form
    setCaption("");
      setFotoGaleri([]);
    fetchGaleri();

      // Show result
      if (successCount > 0 && failCount === 0) {
        alert(`${successCount} foto berhasil ditambahkan!`);
      } else if (successCount > 0 && failCount > 0) {
        alert(`${successCount} foto berhasil, ${failCount} foto gagal!`);
      } else {
        alert("Gagal upload semua foto!");
      }
  } catch (err) {
    console.error(err);
      alert("Terjadi kesalahan saat upload!");
    } finally {
      setUploading(false);
  }
};

  // ===============================
  // DELETE ITEM
  // ===============================
  const deleteItem = async (type, id) => {
    if (!confirm("Yakin ingin menghapus?")) return;

    try {
      await fetch(`${BASEURL}/api/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      if (type === "berita") fetchBerita();
      if (type === "galeri") fetchGaleri();
    } catch (err) {
      alert("Gagal menghapus item");
      console.error(err);
    }
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    // Navigate to login page
    navigate("/login");
  };

  // Handle mentor approval/rejection
  const handleMentorApproval = async (userId, status) => {
    if (!window.confirm(`Apakah Anda yakin ingin ${status === 'active' ? 'menyetujui' : 'menolak'} mentor ini?`)) {
      return;
    }

    try {
      const response = await fetch(`${BASEURL}/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        alert(`Mentor berhasil ${status === 'active' ? 'disetujui' : 'ditolak'}`);
        // Refresh user data
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`Gagal mengupdate status mentor: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating mentor status:', error);
      alert('Terjadi kesalahan saat mengupdate status mentor');
    }
  };

  // Handle view user detail
  const handleViewUserDetail = async (user) => {
    setSelectedUser(user);
    setMentorProfile(null);
    
    if (user.role === 'mentor') {
      setLoadingMentorProfile(true);
      try {
        const response = await fetch(`${BASEURL}/api/users/${user.id}/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMentorProfile(data.mentorProfile);
        } else {
          console.error('Failed to fetch mentor profile');
        }
      } catch (error) {
        console.error('Error fetching mentor profile:', error);
      } finally {
        setLoadingMentorProfile(false);
      }
    }
    
    setShowUserDetail(true);
  };

  // Filter payments berdasarkan status dan tanggal
  const getFilteredPayments = () => {
    let filtered = [...payments];
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    // Filter by date range
    if (filterDateFrom) {
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.date || p.created_at || "2000-01-01");
        const fromDate = new Date(filterDateFrom);
        return paymentDate >= fromDate;
      });
    }
    
    if (filterDateTo) {
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.date || p.created_at || "2000-01-01");
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999); // End of day
        return paymentDate <= toDate;
      });
    }
    
    return filtered;
  };

  const filteredPayments = getFilteredPayments();

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Laporan Keuangan", 14, 20);
    
    // Summary
    doc.setFontSize(12);
    doc.text(`Total Pendapatan: Rp ${filteredPayments.filter(p => p.status === "success").reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString("id-ID")}`, 14, 35);
    doc.text(`Total Transaksi: ${filteredPayments.length}`, 14, 42);
    
    // Table
    const tableData = filteredPayments.map(p => [
      `#${p.id}`,
      p.date || "N/A",
      `Rp ${(p.amount || 0).toLocaleString("id-ID")}`,
      p.status || "pending"
    ]);
    
    doc.autoTable({
      head: [["ID", "Tanggal", "Jumlah", "Status"]],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 165, 207] }
    });
    
    doc.save(`laporan-keuangan-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Download Excel
  const downloadExcel = () => {
    const worksheetData = [
      ["ID", "Tanggal", "Jumlah", "Status"],
      ...filteredPayments.map(p => [
        `#${p.id}`,
        p.date || "N/A",
        p.amount || 0,
        p.status || "pending"
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keuangan");
    
    XLSX.writeFile(workbook, `laporan-keuangan-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Prepare chart data
  const getChartData = () => {
    const monthlyData = {};
    
    filteredPayments.forEach(payment => {
      const date = new Date(payment.date || payment.created_at || new Date());
      const month = date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { month, pendapatan: 0, transaksi: 0 };
      }
      
      if (payment.status === "success") {
        monthlyData[month].pendapatan += payment.amount || 0;
      }
      monthlyData[month].transaksi += 1;
    });
    
    return Object.values(monthlyData).sort((a, b) => {
      return new Date(a.month) - new Date(b.month);
    });
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* NAVBAR - Simple dengan logo, nama, dan settings */}
      <header className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Hamburger Menu & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-[#00A5CF] hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
            >
              {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-12 md:h-16 w-auto" />
            </Link>
          </div>

          {/* Nama Admin & Logout */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold hidden md:block">{adminName}</span>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* SIDEBAR - Fixed dengan toggle */}
        <aside className={`bg-white shadow-lg border-r border-gray-200 fixed left-0 top-[73px] bottom-0 flex flex-col z-40 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}>
          <nav className={`p-4 pt-8 space-y-3 flex-1 overflow-y-auto transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Menu Dashboard */}
            <button
              onClick={() => setActiveMenu("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeMenu === "dashboard"
                  ? "bg-[#00A5CF] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiLayout className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Dashboard</span>
            </button>

            {/* Menu Kelola Berita */}
            <button
              onClick={() => setActiveMenu("berita")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeMenu === "berita"
                  ? "bg-[#00A5CF] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiFileText className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Kelola Berita</span>
            </button>

            {/* Menu Kelola Gallery */}
            <button
              onClick={() => setActiveMenu("galeri")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeMenu === "galeri"
                  ? "bg-[#00A5CF] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiImage className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Kelola Gallery</span>
            </button>

            {/* Menu Kelola Keuangan */}
            <button
              onClick={() => setActiveMenu("keuangan")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeMenu === "keuangan"
                  ? "bg-[#00A5CF] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiDollarSign className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Kelola Keuangan</span>
            </button>

            {/* Menu Kelola User */}
            <button
              onClick={() => setActiveMenu("user")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeMenu === "user"
                  ? "bg-[#00A5CF] text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiUsers className="w-5 h-5 flex-shrink-0" />
              <span className={`font-medium transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Kelola User</span>
            </button>
          </nav>
          
          {/* Jam Real Time - Paling Bawah */}
          <div className={`p-4 border-t border-gray-200 bg-gray-50 mt-auto transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="text-center">
              <p className={`text-gray-600 text-sm font-medium mb-1 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>Waktu</p>
              <p className="text-[#00A5CF] text-xl font-bold font-mono">
                {currentTime.toLocaleTimeString("id-ID", { 
                  hour: "2-digit", 
                  minute: "2-digit", 
                  second: "2-digit",
                  hour12: false 
                })}
              </p>
        </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={`flex-1 overflow-y-auto p-6 md:p-8 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        }`}>
          {/* DASHBOARD CONTENT */}
          {activeMenu === "dashboard" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Berita</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{berita.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiFileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Gallery</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{galeri.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiImage className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total User</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FiUsers className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Pendapatan</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        Rp {payments.filter(p => p.status === "success").reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <FiDollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart - Pendapatan Bulanan */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Pendapatan Bulanan</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { month: "Jan", pendapatan: 2500000 },
                      { month: "Feb", pendapatan: 3200000 },
                      { month: "Mar", pendapatan: 2800000 },
                      { month: "Apr", pendapatan: 3500000 },
                      { month: "Mei", pendapatan: 4200000 },
                      { month: "Jun", pendapatan: payments.filter(p => p.status === "success").reduce((sum, p) => sum + (p.amount || 0), 0) },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
                      <Bar dataKey="pendapatan" fill="#00A5CF" name="Pendapatan" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart - Distribusi User */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Distribusi User</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Member", value: users.filter(u => u.role === "member").length || 0 },
                          { name: "Mentor", value: users.filter(u => u.role === "mentor").length || 0 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                        outerRadius={100}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={5}
                      >
                        {[
                          { name: "Member", value: users.filter(u => u.role === "member").length || 0 },
                          { name: "Mentor", value: users.filter(u => u.role === "mentor").length || 0 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#00A5CF", "#F59E0B"][index]} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} user`, name]}
                        contentStyle={{ 
                          backgroundColor: "#fff", 
                          border: "1px solid #e5e7eb", 
                          borderRadius: "8px",
                          padding: "8px"
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span style={{ color: "#374151", fontWeight: 500 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Kontak */}
              <div className="grid grid-cols-1 gap-6">

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Pesan Masuk Terbaru</h2>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {kontak.slice(0, 5).map((k) => (
                      <div key={k.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <p className="font-semibold text-gray-900">
                          {k.nama} <span className="text-gray-500 text-sm">({k.email})</span>
                        </p>
                        <p className="text-gray-600 mt-1 text-sm">{k.pesan}</p>
                      </div>
                    ))}
                    {kontak.length === 0 && (
                      <p className="text-gray-500 text-center py-8">Belum ada pesan masuk</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* KELOLA BERITA CONTENT */}
          {activeMenu === "berita" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Kelola Berita</h1>

    {/* FORM INPUT/EDIT BERITA */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingBerita ? "Edit Berita" : "Tambah Berita Baru"}
                  </h3>
                  {editingBerita && (
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>

                <div className="space-y-4">
      <input
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none transition-all"
                    placeholder="Judul Berita"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
                    required
      />

      <textarea
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none transition-all resize-none"
                    rows="5"
        placeholder="Isi berita"
        value={content}
        onChange={(e) => setContent(e.target.value)}
                    required
      />

                  <div>
      <input
        type="file"
                      accept="image/*"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
        onChange={(e) => setImage(e.target.files[0])}
      />
                    {editingBerita && editingBerita.image && !image && (
                      <p className="text-sm text-gray-500 mt-2">
                        Gambar saat ini: {editingBerita.image.replace("/uploads/", "")}
                        <br />
                        <span className="text-xs">Kosongkan jika tidak ingin mengubah gambar</span>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
      <button
                      className="flex-1 bg-[#00A5CF] hover:bg-[#0096D6] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      onClick={editingBerita ? updateBerita : createBerita}
      >
                      {editingBerita ? "Perbarui Berita" : "Upload Berita"}
      </button>
                  </div>
                </div>
    </div>

    {/* LIST BERITA */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Berita</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {berita.map((b) => (
        <div
          key={b.id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200"
        >
          {b.image && (
            <img
              src={`${BASEURL}${b.image}`}
                          className="rounded-lg mb-3 w-full h-48 object-cover"
                          alt={b.title}
            />
          )}

                      <h4 className="text-lg font-bold text-gray-900 mb-2">{b.title}</h4>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {b.content?.slice(0, 120)}...
          </p>

                      <div className="flex flex-col gap-2">
          <button
                          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                          onClick={() => {
                            setSelectedBerita(b);
                            setShowBeritaDetail(true);
                          }}
                        >
                          <FiEye className="w-4 h-4" />
                          Lihat Detail
                        </button>
                        <div className="flex gap-2">
                          <button
                            className="flex-1 bg-[#00A5CF] hover:bg-[#0096D6] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                            onClick={() => handleEditBerita(b)}
                          >
                            Edit
                          </button>
                          <button
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            onClick={() => deleteItem("berita", b.id)}
          >
            Hapus
          </button>
                        </div>
                      </div>
        </div>
      ))}
                  {berita.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      Belum ada berita
    </div>
                  )}
                </div>
              </div>
    </div>
          )}

          {/* KELOLA GALLERY CONTENT */}
          {activeMenu === "galeri" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Kelola Gallery</h1>

              {/* FORM INPUT GALERI */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tambah Foto Gallery</h3>

                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      setFotoGaleri(files);
                    }}
                  />
                  {fotoGaleri.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {fotoGaleri.length} foto dipilih
                    </p>
                  )}

                  <input
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none transition-all"
                    placeholder="Caption Foto (untuk semua foto)"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    required
                  />

                  <button
                    className="bg-[#00A5CF] hover:bg-[#0096D6] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={createGaleri}
                    disabled={uploading || fotoGaleri.length === 0}
                  >
                    {uploading ? `Mengupload ${fotoGaleri.length} foto...` : `Upload ${fotoGaleri.length > 0 ? fotoGaleri.length : ''} Foto`}
                  </button>
                </div>
            </div>

              {/* LIST GALERI */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Foto Gallery</h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {galeri.map((g) => (
                    <div
                      key={g.id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all duration-200"
                    >
                  <img 
                    src={`${BASEURL}${g.image}`} 
                        className="rounded-lg mb-3 w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        alt={g.caption}
                        onClick={() => {
                          setSelectedGaleri(g);
                          setShowGaleriDetail(true);
                        }}
                      />
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{g.caption || "Tanpa caption"}</p>
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                          onClick={() => {
                            setSelectedGaleri(g);
                            setShowGaleriDetail(true);
                          }}
                        >
                          <FiEye className="w-4 h-4" />
                          Lihat
                        </button>
                        <button
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                          onClick={() => deleteItem("galeri", g.id)}
                        >
                          Hapus
                        </button>
                      </div>
                </div>
              ))}
                  {galeri.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      Belum ada foto gallery
            </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* KELOLA KEUANGAN CONTENT */}
          {activeMenu === "keuangan" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Kelola Keuangan</h1>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
                  >
                    <FiFilter className="w-5 h-5" />
                    Filter
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <FiDownload className="w-5 h-5" />
                    PDF
                  </button>
                  <button
                    onClick={downloadExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <FiDownload className="w-5 h-5" />
                    Excel
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilter && (
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Transaksi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                      >
                        <option value="all">Semua Status</option>
                        <option value="success">Success</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
              </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                      <input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                      <input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => {
                        setFilterStatus("all");
                        setFilterDateFrom("");
                        setFilterDateTo("");
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md p-6 border border-green-200">
                  <p className="text-gray-600 text-sm font-medium">Total Pendapatan</p>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    Rp {filteredPayments.filter(p => p.status === "success").reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-md p-6 border border-yellow-200">
                  <p className="text-gray-600 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-700 mt-2">
                    Rp {filteredPayments.filter(p => p.status === "pending").reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-md p-6 border border-red-200">
                  <p className="text-gray-600 text-sm font-medium">Failed</p>
                  <p className="text-3xl font-bold text-red-700 mt-2">
                    Rp {filteredPayments.filter(p => p.status === "failed").reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
                  <p className="text-gray-600 text-sm font-medium">Total Transaksi</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">{filteredPayments.length}</p>
                </div>
              </div>

              {/* Chart - Trend Pendapatan */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Trend Pendapatan Bulanan</h2>
                    <p className="text-gray-500 text-sm mt-1">Visualisasi pendapatan per bulan</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-3 h-3 bg-[#00A5CF] rounded-full"></div>
                    <span className="text-sm font-semibold text-gray-700">Pendapatan</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={chartData.length > 0 ? chartData : [
                      { month: "Jan", pendapatan: 0 },
                      { month: "Feb", pendapatan: 0 },
                      { month: "Mar", pendapatan: 0 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6b7280"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tick={{ fill: "#6b7280" }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        tick={{ fill: "#6b7280" }}
                        tickFormatter={(value) => `Rp${(value / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        formatter={(value) => [`Rp ${value.toLocaleString("id-ID")}`, "Pendapatan"]}
                        contentStyle={{ 
                          backgroundColor: "#fff", 
                          border: "2px solid #00A5CF", 
                          borderRadius: "12px",
                          padding: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                          fontSize: "14px",
                          fontWeight: 500
                        }}
                        labelStyle={{ 
                          color: "#00A5CF", 
                          fontWeight: "bold",
                          marginBottom: "8px"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pendapatan" 
                        stroke="#00A5CF" 
                        strokeWidth={4} 
                        name="Pendapatan"
                        dot={{ fill: "#00A5CF", r: 6, strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 10, stroke: "#00A5CF", strokeWidth: 2, fill: "#fff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
              </div>

              {/* Payment List */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Daftar Transaksi</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                    Menampilkan {filteredPayments.length} dari {payments.length} transaksi
                  </span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#00A5CF] to-[#0096D6] text-white">
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">ID Transaksi</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Tanggal</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Jumlah</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Status</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map((payment, index) => (
                        <tr 
                          key={payment.id} 
                          className={`transition-all duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 hover:shadow-sm`}
                        >
                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold text-sm">
                              #{payment.id}
                            </span>
                          </td>
                          <td className="p-4 text-gray-700 font-medium">
                            {payment.date || payment.created_at || "N/A"}
                          </td>
                          <td className="p-4">
                            <span className="text-gray-900 font-bold text-lg">
                              Rp {(payment.amount || 0).toLocaleString("id-ID")}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide ${
                              payment.status === "success"
                                ? "bg-green-100 text-green-800 border-2 border-green-300"
                                : payment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                                : "bg-red-100 text-red-800 border-2 border-red-300"
                            }`}>
                              {payment.status || "pending"}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 text-sm">
                            <span className="bg-gray-100 px-3 py-1.5 rounded-lg">
                              {payment.description || payment.note || "-"}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredPayments.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FiDollarSign className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium text-lg">Tidak ada transaksi yang sesuai dengan filter</p>
                              <p className="text-gray-400 text-sm mt-2">Coba ubah filter atau reset filter untuk melihat semua transaksi</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        )}

          {/* KELOLA USER CONTENT */}
          {activeMenu === "user" && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">Kelola User</h1>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6 border border-blue-200">
                  <p className="text-gray-600 text-sm font-medium">Total User</p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">{users.length}</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl shadow-md p-6 border border-cyan-200">
                  <p className="text-gray-600 text-sm font-medium">Member</p>
                  <p className="text-3xl font-bold text-cyan-700 mt-2">
                    {users.filter(u => u.role === "member").length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-6 border border-purple-200">
                  <p className="text-gray-600 text-sm font-medium">Admin</p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">
                    {users.filter(u => u.role === "admin").length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md p-6 border border-orange-200">
                  <p className="text-gray-600 text-sm font-medium">Mentor</p>
                  <p className="text-3xl font-bold text-orange-700 mt-2">
                    {users.filter(u => u.role === "mentor").length}
                  </p>
                </div>
              </div>

              {/* Chart - Distribusi User */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border-2 border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Distribusi User</h2>
                    <p className="text-gray-500 text-sm mt-1">Mentor & Member</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Member", value: users.filter(u => u.role === "member").length || 0 },
                          { name: "Mentor", value: users.filter(u => u.role === "mentor").length || 0 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
                        outerRadius={100}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={5}
                      >
                        {[
                          { name: "Member", value: users.filter(u => u.role === "member").length || 0 },
                          { name: "Mentor", value: users.filter(u => u.role === "mentor").length || 0 },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#00A5CF", "#F59E0B"][index]} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} user`, name]}
                        contentStyle={{ 
                          backgroundColor: "#fff", 
                          border: "2px solid #00A5CF", 
                          borderRadius: "12px",
                          padding: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                          fontSize: "14px",
                          fontWeight: 500
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span style={{ color: "#374151", fontWeight: 500 }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Summary Stats */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border-2 border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Statistik User</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Total User</p>
                          <p className="text-2xl font-bold text-blue-700">{users.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Member</p>
                          <p className="text-2xl font-bold text-cyan-700">
                            {users.filter(u => u.role === "member").length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Mentor</p>
                          <p className="text-2xl font-bold text-orange-700">
                            {users.filter(u => u.role === "mentor").length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User List */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Daftar User</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                    Total {users.length} user
                  </span>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#00A5CF] to-[#0096D6] text-white">
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">ID User</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Nama</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Email</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Role</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Status</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Tanggal Daftar</th>
                        <th className="text-left p-4 text-sm font-bold uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user, index) => (
                        <tr 
                          key={user.id} 
                          className={`transition-all duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 hover:shadow-sm`}
                        >
                          <td className="p-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold text-sm">
                              #{user.id}
                            </span>
                          </td>
                          <td className="p-4 text-gray-900 font-semibold">{user.name}</td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide border-2 ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800 border-purple-300"
                                : user.role === "mentor"
                                ? "bg-orange-100 text-orange-800 border-orange-300"
                                : "bg-blue-100 text-blue-800 border-blue-300"
                            }`}>
                              {user.role || "member"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border-2 ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : user.status === "pending_approval"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : user.status === "rejected"
                                ? "bg-red-100 text-red-800 border-red-300"
                                : "bg-gray-100 text-gray-800 border-gray-300"
                            }`}>
                              {user.status === "pending_approval" ? "Menunggu Approval" :
                               user.status === "active" ? "Aktif" :
                               user.status === "rejected" ? "Ditolak" :
                               user.status || "Tidak Diketahui"}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 font-medium">
                            {user.created_at || "N/A"}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleViewUserDetail(user)}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-[#00A5CF] hover:bg-[#0096D6] text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                              >
                                <FiEye className="w-4 h-4" />
                                Detail
                              </button>
                              
                              {user.role === "mentor" && user.status === "pending_approval" && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleMentorApproval(user.id, 'active')}
                                    className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                                  >
                                    ✓ Setuju
                                  </button>
                                  <button
                                    onClick={() => handleMentorApproval(user.id, 'rejected')}
                                    className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                                  >
                                    ✗ Tolak
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="7" className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FiUsers className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium text-lg">Belum ada user terdaftar</p>
                              <p className="text-gray-400 text-sm mt-2">User yang terdaftar akan muncul di sini</p>
                              <p className="text-gray-300 text-xs mt-4">Debug: users.length = {users.length}</p>
                              <button 
                                onClick={() => {
                                  console.log("Manual fetch users triggered");
                                  fetchUsers();
                                }}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                              >
                                Refresh Data
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Modal Detail Berita */}
          {showBeritaDetail && selectedBerita && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowBeritaDetail(false);
                setSelectedBerita(null);
              }}
            >
              <div 
                className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header dengan tombol X */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                  <h2 className="text-xl font-bold text-gray-900">Detail Berita</h2>
                  <button
                    onClick={() => {
                      setShowBeritaDetail(false);
                      setSelectedBerita(null);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Gambar */}
                  {selectedBerita.image && (
                    <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={`${BASEURL}${selectedBerita.image}`}
                        alt={selectedBerita.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Judul */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBerita.title}</h3>
                    {selectedBerita.created_at && (
                      <p className="text-sm text-gray-500">
                        {new Date(selectedBerita.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    )}
                  </div>

                  {/* Konten */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {selectedBerita.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Detail Galeri */}
          {showGaleriDetail && selectedGaleri && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowGaleriDetail(false);
                setSelectedGaleri(null);
              }}
            >
              <div 
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header dengan tombol X */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                  <h2 className="text-xl font-bold text-gray-900">Detail Foto Gallery</h2>
                  <button
                    onClick={() => {
                      setShowGaleriDetail(false);
                      setSelectedGaleri(null);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Gambar */}
                  <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={`${BASEURL}${selectedGaleri.image}`}
                      alt={selectedGaleri.caption || "Foto Gallery"}
                      className="w-full h-auto object-contain max-h-[60vh]"
                    />
                  </div>

                  {/* Caption */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Caption</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {selectedGaleri.caption || "Tidak ada caption"}
                    </p>
                  </div>

                  {/* Info Tambahan */}
                  {selectedGaleri.created_at && (
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-500">
                        Diunggah: {new Date(selectedGaleri.created_at).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Modal Detail User */}
          {showUserDetail && selectedUser && (
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => {
                setShowUserDetail(false);
                setSelectedUser(null);
              }}
            >
              <div 
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header - Minimalis */}
                <div className="relative bg-white border-b border-gray-100 p-6">
                  <button
                    onClick={() => {
                      setShowUserDetail(false);
                      setSelectedUser(null);
                    }}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                      selectedUser.role === "admin"
                        ? "bg-gradient-to-br from-purple-500 to-purple-600"
                        : selectedUser.role === "mentor"
                        ? "bg-gradient-to-br from-orange-500 to-orange-600"
                        : "bg-gradient-to-br from-blue-500 to-cyan-500"
                    }`}>
                      {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedUser.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : selectedUser.role === "mentor"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {selectedUser.role === "admin" ? "Administrator" : selectedUser.role === "mentor" ? "Mentor" : "Member"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                          Aktif
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content - Minimalis */}
                <div className="p-6 space-y-4">
                  {/* Email */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900 break-all">{selectedUser.email}</p>
                    </div>
                  </div>

                  {/* Tanggal Daftar */}
                  <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tanggal Daftar</p>
                      <p className="text-sm font-medium text-gray-900">{selectedUser.created_at || "Tidak tersedia"}</p>
                    </div>
                  </div>

                  {/* Informasi Role */}
                  {selectedUser.role === "member" && (
                    <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Tentang Member
                      </h3>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Akses ke dashboard dan courses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Dapat mengedit profil di Settings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Melihat capaian belajar</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {selectedUser.role === "mentor" && (
                    <div className="mt-4 space-y-4">
                      {/* Status Mentor */}
                      <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Status Mentor
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border-2 ${
                            selectedUser.status === "active"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : selectedUser.status === "pending_approval"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : selectedUser.status === "rejected"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-gray-100 text-gray-800 border-gray-300"
                          }`}>
                            {selectedUser.status === "pending_approval" ? "Menunggu Approval" :
                             selectedUser.status === "active" ? "Aktif" :
                             selectedUser.status === "rejected" ? "Ditolak" :
                             selectedUser.status || "Tidak Diketahui"}
                          </span>
                          {selectedUser.status === "pending_approval" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMentorApproval(selectedUser.id, 'active')}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 text-xs"
                              >
                                ✓ Setuju
                              </button>
                              <button
                                onClick={() => handleMentorApproval(selectedUser.id, 'rejected')}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 text-xs"
                              >
                                ✗ Tolak
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Profile Mentor */}
                      <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profil Mentor
                        </h3>
                        
                        {loadingMentorProfile ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                            <span className="ml-2 text-sm text-gray-600">Memuat profil...</span>
                          </div>
                        ) : mentorProfile ? (
                          <div className="space-y-3">
                            {/* Biodata */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Nama Lengkap:</span>
                                <p className="text-gray-900">{mentorProfile.nama_lengkap || selectedUser.name}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Tempat Lahir:</span>
                                <p className="text-gray-900">{mentorProfile.tempat_lahir || '-'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Tanggal Lahir:</span>
                                <p className="text-gray-900">{mentorProfile.tanggal_lahir || '-'}</p>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Jenis Kelamin:</span>
                                <p className="text-gray-900">{mentorProfile.jenis_kelamin || '-'}</p>
                              </div>
                            </div>

                            {/* Bahasa yang diajarkan */}
                            {mentorProfile.bahasa_ajar && mentorProfile.bahasa_ajar.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-700 text-sm">Bahasa yang Ddiajarkan:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {mentorProfile.bahasa_ajar.map((bahasa, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                      {bahasa}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Pendidikan */}
                            {mentorProfile.pendidikan && mentorProfile.pendidikan.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-700 text-sm">Riwayat Pendidikan:</span>
                                <div className="mt-1 space-y-1">
                                  {mentorProfile.pendidikan.map((edu, index) => (
                                    <div key={index} className="text-xs bg-white p-2 rounded border">
                                      <p className="font-medium">{edu.jenjang} - {edu.jurusan}</p>
                                      <p className="text-gray-600">{edu.institusi}, {edu.tahun_lulus}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Sertifikat */}
                            {mentorProfile.sertifikat && mentorProfile.sertifikat.length > 0 && (
                              <div>
                                <span className="font-medium text-gray-700 text-sm">Sertifikat Skill:</span>
                                <div className="mt-1 space-y-1">
                                  {mentorProfile.sertifikat.map((cert, index) => (
                                    <div key={index} className="text-xs bg-white p-2 rounded border">
                                      <p className="font-medium">{cert.nama_sertifikat}</p>
                                      <p className="text-gray-600">{cert.penerbit}, {cert.tahun}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Pengalaman */}
                            {mentorProfile.pengalaman && (
                              <div>
                                <span className="font-medium text-gray-700 text-sm">Pengalaman Mengajar:</span>
                                <p className="text-gray-900 text-sm mt-1">{mentorProfile.pengalaman} tahun</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">Profil mentor belum lengkap atau tidak ditemukan.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer - Minimalis */}
                <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setShowUserDetail(false);
                      setSelectedUser(null);
                      setMentorProfile(null);
                    }}
                    className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-200 text-sm"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
