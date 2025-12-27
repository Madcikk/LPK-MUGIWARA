import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUsers, FiCalendar, FiUser } from 'react-icons/fi';
import eropaImg from '../../assets/eropa.jpg';

export default function Eropa() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    nama: '',
    email: '',
    telp: '',
    metode: '',
  });

  const [snapLoaded, setSnapLoaded] = useState(false);

  const biaya = 5000000;
  const programId = 1;

  useEffect(() => {
    const clientKey = 'Mid-client-9c6u0nSKYuHg02DR';

    const scriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';

    const scriptId = 'midtrans-script';
    if (document.getElementById(scriptId)) {
      setSnapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.id = scriptId;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;

    script.onload = () => {
      console.log('Snap Script Loaded: FORCED SANDBOX MODE');
      setSnapLoaded(true);
    };

    document.body.appendChild(script);

    return () => {
      const scriptTag = document.getElementById(scriptId);
      if (scriptTag) document.body.removeChild(scriptTag);
    };
  }, []);

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!payment.nama || !payment.email || !payment.telp) {
      return alert('Harap isi Nama, Email, dan No Telp.');
    }

    if (!snapLoaded) {
      return alert('Sistem pembayaran sedang dimuat atau terblokir AdBlocker. Mohon tunggu sejenak atau refresh halaman.');
    }

    try {
      const response = await fetch('http://localhost:5000/api/payment/process-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama: payment.nama,
          email: payment.email,
          telp: payment.telp,
          biaya: biaya,
          program_id: programId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal memproses transaksi');
      }

      if (window.snap && data.token) {
        window.snap.pay(data.token, {
          onSuccess: function (result) {
            alert('Pembayaran Berhasil!');
            console.log(result);
          },
          onPending: function (result) {
            alert('Menunggu Pembayaran...');
            console.log(result);
          },
          onError: function (result) {
            alert('Pembayaran Gagal!');
            console.log(result);
          },
          onClose: function () {
            alert('Anda menutup popup tanpa menyelesaikan pembayaran');
          },
        });
      } else {
        alert('Token diterima tapi Snap.js tidak berjalan. Cek console.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-[#00A5CF] mb-8 transition-all duration-200 group bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md border border-gray-200"
        >
          <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DETAIL PROGRAM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 backdrop-blur-sm">
              {/* Hero Image */}
              <div className="relative h-72 md:h-96 overflow-hidden group">
                <img 
                  src={eropaImg} 
                  alt="Eropa" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                    Pelatihan Bahasa Eropa
                  </h1>
                  <p className="text-white/95 text-lg md:text-xl font-medium drop-shadow-md">
                    Program bahasa Eropa intensif untuk persiapan kerja di Eropa
                  </p>
                </div>
              </div>

              {/* Program Details */}
              <div className="p-8 md:p-10">
                {/* Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FiClock className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Durasi</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">5 Bulan</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-5 border border-green-200/50 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FiUsers className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Kapasitas</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">10/15</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-5 border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FiCalendar className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Mulai</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">5/8/2025</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-5 border border-orange-200/50 shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <FiUser className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Instruktur</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">Tony Chopper</p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-gradient-to-r from-[#00A5CF] via-[#0096D6] to-[#0085C3] rounded-2xl p-7 text-white shadow-xl border border-blue-400/20">
                  <p className="text-sm font-semibold mb-3 opacity-95 uppercase tracking-wide">Jadwal Kelas</p>
                  <p className="text-3xl font-bold">Senin - Sabtu, 18:00 - 21:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT FORM */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/50 backdrop-blur-sm p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Form Pembayaran</h2>
                <p className="text-gray-600 text-sm">Lengkapi data untuk melanjutkan pembayaran</p>
              </div>

              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Masukan nama lengkap"
                    value={payment.nama}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email@example.com"
                    value={payment.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                    No. Telepon
                  </label>
                  <input
                    type="text"
                    name="telp"
                    placeholder="0854xxxxxxx"
                    value={payment.telp}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] outline-none transition-all bg-gray-50/50 focus:bg-white text-gray-900 placeholder-gray-400 font-medium"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border-2 border-gray-200/50 shadow-inner">
                <p className="text-sm text-gray-600 mb-2 font-medium">Total Biaya</p>
                <p className="text-4xl font-bold text-[#00A5CF]">
                  Rp {biaya.toLocaleString('id-ID')}
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!snapLoaded}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 ${
                  snapLoaded
                    ? 'bg-gradient-to-r from-[#00A5CF] via-[#0096D6] to-[#0085C3] hover:from-[#0096D6] hover:via-[#00A5CF] hover:to-[#0096D6] text-white transform hover:scale-[1.02] hover:shadow-2xl active:scale-100'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
              >
                {snapLoaded ? 'Bayar Sekarang' : 'Memuat Pembayaran...'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
