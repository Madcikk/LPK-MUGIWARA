import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postStep } from "../api/member";
import { FiArrowLeft } from "react-icons/fi";

export default function RegisterStep4() {
  const navigate = useNavigate();
  const member_id = localStorage.getItem("member_id");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      alert("Pilih foto terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      await postStep(4, { member_id }, file);
      alert("Foto berhasil diupload!");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!file) {
      alert("Silakan upload foto terlebih dahulu!");
      return;
    }
    
    try {
      // Upload foto dulu
      await handleSubmit();
      
      // Kemudian panggil step5 untuk finalisasi dan buat user account
      const member_id = localStorage.getItem("member_id");
      if (member_id) {
        const response = await fetch(`http://localhost:5000/register/step5`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ member_id })
        });
        
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Gagal menyelesaikan pendaftaran");
        }
        
        // Simpan info password default jika ada
        if (result.default_password) {
          localStorage.setItem('default_password', result.default_password);
          localStorage.setItem('user_email', result.email || '');
        } else if (result.user_exists && result.email) {
          // Jika user sudah ada, simpan email untuk info
          localStorage.setItem('user_email', result.email);
        }
      }
      
      navigate("/register/finish");
    } catch (err) {
      alert("Gagal menyelesaikan pendaftaran: " + err.message);
    }
  };

  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex flex-col">
      {/* Header dengan icon back */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/register/step3")}
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
            <span className="text-sm font-medium text-gray-700">Step 4 dari 4</span>
            <span className="text-sm font-medium text-gray-700">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00A5CF] h-2 rounded-full transition-all duration-300"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* HEADER */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A5CF] to-[#0096D6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                4
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Foto Diri</h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              Upload foto diri terbaru dengan format JPG/PNG, maksimal 5MB
            </p>
          </div>
          <div className="flex flex-col items-center">
            {/* UPLOAD AREA */}
            <div className="w-full max-w-md">
              <label className="block text-gray-700 mb-2 font-medium text-sm">
                Foto Diri <span className="text-red-500">*</span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#00A5CF] transition-colors duration-300 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div className="space-y-4">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="mx-auto w-48 h-48 object-cover rounded-lg border-2 border-gray-200 shadow-md"
                      />
                      <p className="text-sm text-gray-600">{file.name}</p>
                      <p className="text-xs text-gray-500">Klik untuk mengganti foto</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Klik untuk memilih foto</p>
                        <p className="text-sm text-gray-500 mt-1">atau drag & drop foto di sini</p>
                      </div>
                      <p className="text-xs text-gray-400">JPG, PNG maksimal 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/register/step3")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Kembali
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!file || loading}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Mengupload..." : "Simpan Foto"}
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={!file || loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
