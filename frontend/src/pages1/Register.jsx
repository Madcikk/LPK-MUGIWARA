import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiBookOpen, FiArrowLeft } from "react-icons/fi";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex flex-col">
      {/* Header dengan icon back */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-700 hover:text-[#00A5CF] transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali ke Beranda</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pendaftaran Online
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Selamat datang di sistem pendaftaran online LPK Mugiwara. 
              Pilih jenis pendaftaran sesuai dengan kebutuhan Anda.
            </p>
          </div>

          {/* Dua Opsi Registrasi */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Opsi Member */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-xl">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Daftar sebagai Member
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Belajar bahasa untuk persiapan karir ke luar negeri. 
                  Akses materi pembelajaran, kelas interaktif, dan sertifikat.
                </p>
              </div>
              <button
                onClick={() => navigate("/register/step1")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Daftar sebagai Member
              </button>
            </div>

            {/* Opsi Mentor */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 border-2 border-green-200 hover:border-green-400 transition-all duration-200 hover:shadow-xl">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBookOpen className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Daftar sebagai Mentor
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Ajarkan bahasa dan bantu siswa mencapai tujuan mereka. 
                  Berbagi pengetahuan dan pengalaman Anda.
                </p>
              </div>
              <button
                onClick={() => navigate("/register/mentor")}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Daftar sebagai Mentor
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Sudah punya akun?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Login di sini
              </a>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
