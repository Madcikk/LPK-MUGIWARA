import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings, FiCamera, FiSave, FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiLogOut } from "react-icons/fi";
import logo from "./components/aset/logo.png";
import compressImage from "browser-image-compression";

const BASEURL = "http://localhost:5000";

export default function MemberSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [member, setMember] = useState({
    nama: "",
    email: "",
    no_hp: "",
    alamat_rumah: "",
    foto: "https://via.placeholder.com/150",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASEURL}/register/profile`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMember({
            nama: data.nama || data.name || "",
            email: data.email || "",
            no_hp: data.no_hp || "",
            alamat_rumah: data.alamat_rumah || "",
            foto: data.foto ? `${BASEURL}/uploads/${data.foto}` : "https://via.placeholder.com/150",
          });
          if (data.foto) {
            setPreviewImage(`${BASEURL}/uploads/${data.foto}`);
          }
        } else {
          const nameFromStorage = localStorage.getItem("name");
          setMember({
            nama: nameFromStorage || "",
            email: localStorage.getItem("email") || "",
            no_hp: "",
            alamat_rumah: "",
            foto: "https://via.placeholder.com/150",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        const nameFromStorage = localStorage.getItem("name");
        setMember({
          nama: nameFromStorage || "",
          email: localStorage.getItem("email") || "",
          no_hp: "",
          alamat_rumah: "",
          foto: "https://via.placeholder.com/150",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const processImageFile = async (file) => {
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran file maksimal 5MB");
      return;
    }

    try {
      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressed = await compressImage(file, options);
      
      // Simpan file yang sudah di-compress
      setCompressedFile(compressed);

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(compressed);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Gagal memproses gambar");
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    await processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processImageFile(file);
      // Set file to input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      // Validasi: minimal harus ada 1 field yang diubah atau foto yang diupload
      const hasFoto = compressedFile || fileInputRef.current?.files[0];
      const hasNama = member.nama && member.nama.trim() !== "";
      const hasEmail = member.email && member.email.trim() !== "";
      const hasNoHp = member.no_hp && member.no_hp.trim() !== "";
      const hasAlamat = member.alamat_rumah && member.alamat_rumah.trim() !== "";

      if (!hasFoto && !hasNama && !hasEmail && !hasNoHp && !hasAlamat) {
        setErrors({ general: "Minimal harus ada satu field yang diubah atau foto yang diupload" });
        setSaving(false);
        return;
      }

      // Validasi format email jika diisi
      if (hasEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(member.email)) {
          setErrors({ email: "Format email tidak valid" });
          setSaving(false);
          return;
        }
      }

      const token = localStorage.getItem("token");
      const formData = new FormData();
      
      // Hanya append field yang memiliki nilai
      if (hasNama) {
        formData.append("nama", member.nama.trim());
      }
      if (hasEmail) {
        formData.append("email", member.email.trim());
      }
      if (hasNoHp) {
        formData.append("no_hp", member.no_hp.trim());
      }
      if (hasAlamat) {
        formData.append("alamat_rumah", member.alamat_rumah.trim());
      }

      // Jika ada gambar baru (gunakan file yang sudah di-compress jika ada)
      if (compressedFile) {
        formData.append("foto", compressedFile);
      } else if (fileInputRef.current?.files[0]) {
        formData.append("foto", fileInputRef.current.files[0]);
      }

      const response = await fetch(`${BASEURL}/api/member/update-profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile berhasil diperbarui!");
        // Update localStorage
        if (member.nama) {
          localStorage.setItem("name", member.nama);
        }
        if (member.email) {
          localStorage.setItem("email", member.email);
        }
        // Reset compressed file
        setCompressedFile(null);
        // Redirect ke beranda member untuk melihat perubahan
        navigate("/member");
      } else {
        setErrors(data.errors || { general: data.message || data.error || "Gagal memperbarui profile" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ general: "Terjadi kesalahan saat memperbarui profile" });
    } finally {
      setSaving(false);
    }
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
            className="text-gray-700 hover:text-[#00A5CF] font-medium transition-colors duration-200 relative group"
          >
            Courses
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00A5CF] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-3">
            <img
              src={previewImage || member.foto}
              alt="Foto Member"
              className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
            />
            <div className="hidden md:block">
              <p className="font-semibold text-gray-700 text-sm">{member.nama || "Member"}</p>
            </div>
          </div>
          <Link
            to="/member/settings"
            className="p-2 text-[#00A5CF] hover:bg-gray-100 rounded-lg transition-colors duration-200"
            title="Settings"
          >
            <FiSettings className="w-5 h-5" />
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("name");
              localStorage.removeItem("email");
              navigate("/login");
            }}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            title="Logout"
          >
            <FiLogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#00A5CF]/20 border-t-[#00A5CF]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FiSettings className="w-6 h-6 text-[#00A5CF] animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#00A5CF] transition-all duration-200 group bg-white px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-[#00A5CF]/30"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Kembali</span>
            </button>

            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#00A5CF] via-[#0096D6] to-[#0085C3] rounded-3xl shadow-2xl p-8 md:p-10 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FiSettings className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-1">Pengaturan Profile</h1>
                    <p className="text-white/90 text-lg">Kelola informasi dan foto profile Anda</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Photo Upload Section */}
              <div className="p-8 md:p-10 border-b border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
                <label className="block text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiCamera className="w-5 h-5 text-[#00A5CF]" />
                  Foto Profile
                </label>
                
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Photo Preview */}
                  <div className="relative group">
                    <div className="relative">
                      <img
                        src={previewImage || member.foto}
                        alt="Profile"
                        className="w-40 h-40 rounded-2xl border-4 border-gray-200 object-cover shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-[#00A5CF] to-[#0096D6] rounded-xl flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
                    >
                      <FiCamera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>

                  {/* Upload Area */}
                  <div className="flex-1 w-full">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
                        isDragging
                          ? "border-[#00A5CF] bg-blue-50/50 scale-105"
                          : "border-gray-300 hover:border-[#00A5CF]/50 hover:bg-gray-50/50"
                      }`}
                    >
                      <div className="text-center">
                        <FiCamera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Drag & drop foto di sini atau klik untuk memilih
                        </p>
                        <p className="text-xs text-gray-500 mb-4">
                          Format: JPG, PNG (maks. 5MB)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-2.5 bg-gradient-to-r from-[#00A5CF] to-[#0096D6] hover:from-[#0096D6] hover:to-[#00A5CF] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          Pilih Foto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields Section */}
              <div className="p-8 md:p-10">

                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-[#00A5CF]" />
                  Informasi Pribadi
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Nama Lengkap */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-gray-400" />
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nama"
                        value={member.nama}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 font-medium group-hover:border-gray-300"
                        placeholder="Masukkan nama lengkap"
                      />
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00A5CF] transition-colors" />
                    </div>
                    {errors.nama && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span>•</span> {errors.nama}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={member.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 font-medium group-hover:border-gray-300"
                        placeholder="email@example.com"
                      />
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00A5CF] transition-colors" />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span>•</span> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* No. Telepon */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      No. Telepon
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="no_hp"
                        value={member.no_hp}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 font-medium group-hover:border-gray-300"
                        placeholder="08xxxxxxxxxx"
                      />
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00A5CF] transition-colors" />
                    </div>
                    {errors.no_hp && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span>•</span> {errors.no_hp}
                      </p>
                    )}
                  </div>

                  {/* Alamat Rumah */}
                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2.5 flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-gray-400" />
                      Alamat Rumah
                    </label>
                    <div className="relative">
                      <textarea
                        name="alamat_rumah"
                        value={member.alamat_rumah}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] outline-none transition-all bg-gray-50/50 focus:bg-white resize-none text-gray-900 placeholder-gray-400 font-medium group-hover:border-gray-300"
                        placeholder="Masukkan alamat lengkap"
                      />
                      <FiMapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#00A5CF] transition-colors" />
                    </div>
                    {errors.alamat_rumah && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <span>•</span> {errors.alamat_rumah}
                      </p>
                    )}
                  </div>
                </div>

                {errors.general && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 rounded-xl animate-pulse">
                    <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {errors.general}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#00A5CF] via-[#0096D6] to-[#0085C3] hover:from-[#0096D6] hover:via-[#00A5CF] hover:to-[#0096D6] text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 min-w-[180px]"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-5 h-5" />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

