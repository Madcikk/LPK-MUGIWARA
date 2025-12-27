import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postStep } from '../api/member';
import { FiArrowLeft } from 'react-icons/fi';

export default function RegisterStep2() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    nama_smp: '',
    tahun_masuk_smp: '',
    tahun_lulus_smp: '',
    nama_sma_smk: '',
    tahun_masuk_sma_smk: '',
    tahun_lulus_sma_smk: '',
  });

  const [errors, setErrors] = useState({});

  // Load step1 data dari localStorage
  useEffect(() => {
    const step1Data = localStorage.getItem('step1_data');
    if (step1Data) {
      // Data step1 sudah ada di localStorage
    }
  }, []);

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  // Validasi opsional: hanya validasi field yang diisi
  const validate = () => {
    let err = {};
    
    // Validasi SMP: jika salah satu field SMP diisi, semua harus diisi
    const smpFilled = data.nama_smp || data.tahun_masuk_smp || data.tahun_lulus_smp;
    if (smpFilled) {
      if (!data.nama_smp) err.nama_smp = 'Wajib diisi jika mengisi riwayat SMP';
      if (!data.tahun_masuk_smp) err.tahun_masuk_smp = 'Wajib diisi jika mengisi riwayat SMP';
      if (!data.tahun_lulus_smp) err.tahun_lulus_smp = 'Wajib diisi jika mengisi riwayat SMP';
    }

    // Validasi SMA/SMK: jika salah satu field SMA/SMK diisi, semua harus diisi
    const smaFilled = data.nama_sma_smk || data.tahun_masuk_sma_smk || data.tahun_lulus_sma_smk;
    if (smaFilled) {
      if (!data.nama_sma_smk) err.nama_sma_smk = 'Wajib diisi jika mengisi riwayat SMA/SMK';
      if (!data.tahun_masuk_sma_smk) err.tahun_masuk_sma_smk = 'Wajib diisi jika mengisi riwayat SMA/SMK';
      if (!data.tahun_lulus_sma_smk) err.tahun_lulus_sma_smk = 'Wajib diisi jika mengisi riwayat SMA/SMK';
    }

    // Minimal harus mengisi salah satu (SMP atau SMA/SMK)
    if (!smpFilled && !smaFilled) {
      err.general = 'Minimal isi salah satu riwayat pendidikan (SMP atau SMA/SMK)';
    }
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      alert('Silakan lengkapi field yang sudah diisi');
      return;
    }
    
    // Simpan ke localStorage saja
    localStorage.setItem('step2_data', JSON.stringify(data));
    alert('Data berhasil disimpan!');
  };

  const handleNext = async () => {
    if (!validate()) {
      alert('Silakan lengkapi field yang sudah diisi atau isi minimal salah satu riwayat pendidikan');
      return;
    }
    
    try {
      console.log('Step 2: Memulai proses simpan...');
      
      // Simpan step2 ke localStorage
      localStorage.setItem('step2_data', JSON.stringify(data));
      
      // Ambil data step1 dari localStorage
      const step1DataStr = localStorage.getItem('step1_data');
      if (!step1DataStr) {
        alert('Data step 1 tidak ditemukan. Silakan kembali ke step 1.');
        navigate('/register/step1');
        return;
      }
      
      const step1Data = JSON.parse(step1DataStr);
      console.log('Step 2: Data step1 ditemukan');
      
      // Hitung umur dari tanggal lahir
      const tanggalLahir = new Date(step1Data.tanggal_lahir);
      const today = new Date();
      const umur = today.getFullYear() - tanggalLahir.getFullYear();
      const monthDiff = today.getMonth() - tanggalLahir.getMonth();
      const calculatedUmur = monthDiff < 0 || (monthDiff === 0 && today.getDate() < tanggalLahir.getDate()) ? umur - 1 : umur;

      // Siapkan data step1 untuk dikirim
      const step1DataToSend = {
        ...step1Data,
        umur: calculatedUmur.toString(),
        hobi: '', // Set empty karena field dihapus
      };

      console.log('Step 2: Menyimpan step1 ke database...');
      // Simpan step1 ke database
      const res1 = await postStep(1, step1DataToSend);
      const member_id = res1.member_id;
      console.log('Step 2: Step1 berhasil, member_id:', member_id);
      
      console.log('Step 2: Menyimpan step2 ke database...');
      // Simpan step2 ke database
      await postStep(2, { ...data, member_id });
      console.log('Step 2: Step2 berhasil disimpan');
      
      // Simpan member_id ke localStorage
      localStorage.setItem('member_id', member_id);
      
      // Hapus data sementara dari localStorage
      localStorage.removeItem('step1_data');
      localStorage.removeItem('step2_data');
      
      console.log('Step 2: Redirect ke step3...');
      navigate('/register/step3'); // Step 3 sekarang adalah buat akun login
    } catch (err) {
      console.error('Step 2 Error:', err);
      alert('Gagal menyimpan: ' + (err.message || err.toString()));
    }
  };

  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex flex-col">
      {/* Header dengan icon back */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/register/step1")}
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
            <span className="text-sm font-medium text-gray-700">Step 2 dari 4</span>
            <span className="text-sm font-medium text-gray-700">50%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00A5CF] h-2 rounded-full transition-all duration-300"
              style={{ width: "50%" }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* HEADER */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A5CF] to-[#0096D6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                2
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Riwayat Pendidikan</h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              Field bersifat opsional. Isi sesuai dengan riwayat pendidikan Anda.
            </p>
          </div>
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* SMP SECTION */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Pendidikan SMP <span className="text-gray-500 text-sm font-normal">(Opsional)</span>
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Isi jika Anda lulusan SMP. Jika mengisi salah satu field, semua field SMP harus diisi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 font-medium text-sm">
                  Nama SMP
                </label>
                <input
                  name="nama_smp"
                  value={data.nama_smp}
                  onChange={handleChange}
                  className={`p-3 rounded-lg border ${errors.nama_smp ? 'border-red-500' : 'border-gray-300 focus:ring-[#00A5CF] focus:border-[#00A5CF]'} outline-none transition-colors`}
                  placeholder="Nama SMP"
                />
                {errors.nama_smp && <small className="text-red-500 mt-1 text-xs">{errors.nama_smp}</small>}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 font-medium text-sm">
                  Tahun Masuk
                </label>
                <input
                  name="tahun_masuk_smp"
                  value={data.tahun_masuk_smp}
                  onChange={handleChange}
                  type="number"
                  min="1990"
                  max="2024"
                  className={`p-3 rounded-lg border ${errors.tahun_masuk_smp ? 'border-red-500' : 'border-gray-300 focus:ring-[#00A5CF] focus:border-[#00A5CF]'} outline-none transition-colors`}
                  placeholder="Tahun"
                />
                {errors.tahun_masuk_smp && <small className="text-red-500 mt-1 text-xs">{errors.tahun_masuk_smp}</small>}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 font-medium text-sm">
                  Tahun Lulus
                </label>
                <input
                  name="tahun_lulus_smp"
                  value={data.tahun_lulus_smp}
                  onChange={handleChange}
                  type="number"
                  min="1990"
                  max="2024"
                  className={`p-3 rounded-lg border ${errors.tahun_lulus_smp ? 'border-red-500' : 'border-gray-300 focus:ring-[#00A5CF] focus:border-[#00A5CF]'} outline-none transition-colors`}
                  placeholder="Tahun"
                />
                {errors.tahun_lulus_smp && <small className="text-red-500 mt-1 text-xs">{errors.tahun_lulus_smp}</small>}
              </div>
            </div>
          </div>

          {/* SMA/SMK SECTION */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Pendidikan SMA/SMK <span className="text-gray-500 text-sm font-normal">(Opsional)</span>
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Isi jika Anda lulusan SMA/SMK. Jika mengisi salah satu field, semua field SMA/SMK harus diisi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 font-medium text-sm">
                  Nama SMA/SMK
                </label>
                <input
                  name="nama_sma_smk"
                  value={data.nama_sma_smk}
                  onChange={handleChange}
                  className={`p-3 rounded-lg border ${errors.nama_sma_smk ? 'border-red-500' : 'border-gray-300 focus:ring-[#00A5CF] focus:border-[#00A5CF]'} outline-none transition-colors`}
                  placeholder="Nama SMA/SMK"
                />
                {errors.nama_sma_smk && <small className="text-red-500 mt-1 text-xs">{errors.nama_sma_smk}</small>}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 font-medium text-sm">
                  Tahun Masuk
                </label>
                <input
                  name="tahun_masuk_sma_smk"
                  value={data.tahun_masuk_sma_smk}
                  onChange={handleChange}
                  type="number"
                  min="1990"
                  max="2024"
                  className={`p-3 rounded-lg border ${errors.tahun_masuk_sma_smk ? 'border-red-500' : 'border-gray-300 focus:ring-[#00A5CF] focus:border-[#00A5CF]'} outline-none transition-colors`}
                  placeholder="Tahun"
                />
                {errors.tahun_masuk_sma_smk && <small className="text-red-500 mt-1 text-xs">{errors.tahun_masuk_sma_smk}</small>}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 mb-2 font-medium text-sm">
                  Tahun Lulus
                </label>
                <input
                  name="tahun_lulus_sma_smk"
                  value={data.tahun_lulus_sma_smk}
                  onChange={handleChange}
                  type="number"
                  min="1990"
                  max="2024"
                  className={`p-3 rounded-lg border ${errors.tahun_lulus_sma_smk ? 'border-red-500' : 'border-gray-300 focus:ring-[#00A5CF] focus:border-[#00A5CF]'} outline-none transition-colors`}
                  placeholder="Tahun"
                />
                {errors.tahun_lulus_sma_smk && <small className="text-red-500 mt-1 text-xs">{errors.tahun_lulus_sma_smk}</small>}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/register/step1")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Kembali
            </button>
            <div className="flex gap-4">
              <button 
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200"
                onClick={handleSave}
              >
                Simpan Data
              </button>
              <button 
                className="px-6 py-3 bg-[#00A5CF] hover:bg-[#0096D6] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleNext}
              >
                Lanjut
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
