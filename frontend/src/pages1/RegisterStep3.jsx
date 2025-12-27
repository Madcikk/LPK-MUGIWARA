import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const BASEURL = "http://localhost:5000";

export default function RegisterStep3() {
  const navigate = useNavigate();
  const member_id = localStorage.getItem("member_id");

  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    // Clear error saat user mengetik
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    let err = {};

    if (!data.email) {
      err.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      err.email = "Format email tidak valid";
    }

    if (!data.password) {
      err.password = "Password wajib diisi";
    } else if (data.password.length < 6) {
      err.password = "Password minimal 6 karakter";
    }

    if (!data.confirmPassword) {
      err.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (data.password !== data.confirmPassword) {
      err.confirmPassword = "Password tidak cocok";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleFinish = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      // Panggil endpoint untuk membuat user account dan finalisasi registrasi
      const response = await fetch(`${BASEURL}/register/step5`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          member_id,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyelesaikan pendaftaran");
      }

      // Hapus data sementara
      localStorage.removeItem("member_id");
      localStorage.removeItem("step1_data");
      localStorage.removeItem("step2_data");

      navigate("/register/finish");
    } catch (err) {
      alert("Gagal menyelesaikan pendaftaran: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex flex-col">
      {/* Header dengan icon back */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/register/step2")}
            className="flex items-center gap-2 text-gray-700 hover:text-[#00A5CF] transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step 3 dari 4</span>
            <span className="text-sm font-medium text-gray-700">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00A5CF] h-2 rounded-full transition-all duration-300"
              style={{ width: "75%" }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* HEADER */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A5CF] to-[#0096D6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                3
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Buat Akun Login</h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              Buat akun untuk dapat login ke dashboard member.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            {/* GRID LAYOUT - 2 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* EMAIL - KOLOM 1 */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={handleChange}
                  className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${
                    errors.email
                      ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500"
                      : "border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300"
                  } outline-none bg-gray-50/50 focus:bg-white`}
                  placeholder="contoh@email.com"
                />
                {errors.email && (
                  <small className="text-red-500 mt-1 text-xs font-medium">{errors.email}</small>
                )}
              </div>

              {/* PASSWORD - KOLOM 1 */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  value={data.password}
                  onChange={handleChange}
                  className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${
                    errors.password
                      ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500"
                      : "border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300"
                  } outline-none bg-gray-50/50 focus:bg-white`}
                  placeholder="Minimal 6 karakter"
                />
                {errors.password && (
                  <small className="text-red-500 mt-1 text-xs font-medium">{errors.password}</small>
                )}
              </div>

              {/* KONFIRMASI PASSWORD - KOLOM 2 */}
              <div className="flex flex-col">
                <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${
                    errors.confirmPassword
                      ? "border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500"
                      : "border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300"
                  } outline-none bg-gray-50/50 focus:bg-white`}
                  placeholder="Ulangi password"
                />
                {errors.confirmPassword && (
                  <small className="text-red-500 mt-1 text-xs font-medium">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/register/step2")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyelesaikan..." : "Selesai"}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
