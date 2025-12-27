import React from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterFinish() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-6 py-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
          {/* SUCCESS ICON */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Registrasi Berhasil!
          </h1>
          
          <p className="text-gray-600 text-sm md:text-base mb-4 leading-relaxed">
            Terima kasih telah mendaftar di LPK Mugiwara. Data pendaftaran Anda telah kami terima dan akan segera kami proses.
          </p>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4 text-left">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Akun Login Berhasil Dibuat
            </h3>
            <p className="text-gray-700 text-xs">
              Akun login Anda telah berhasil dibuat. Anda dapat langsung login menggunakan email dan password yang telah Anda buat di step 3.
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">Langkah selanjutnya:</h3>
            <ul className="space-y-1.5 text-gray-700 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-[#00A5CF] mt-0.5">•</span>
                <span>Login menggunakan email dan password yang telah Anda buat</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A5CF] mt-0.5">•</span>
                <span>Tim kami akan menghubungi Anda melalui WhatsApp untuk konfirmasi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00A5CF] mt-0.5">•</span>
                <span>Pastikan nomor WhatsApp Anda aktif dan dapat dihubungi</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/member")}
              className="px-5 py-2.5 bg-[#00A5CF] hover:bg-[#0096D6] text-white rounded-lg font-medium transition-colors duration-300 shadow-md hover:shadow-lg text-sm"
            >
              Lihat Dashboard
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-300 text-sm"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
