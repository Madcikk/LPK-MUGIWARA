import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postStep } from '../api/member';
import { FiArrowLeft } from 'react-icons/fi';

export default function RegisterStep1() {
  const navigate = useNavigate();

  // ==========================
  // DATA DIRI
  // ==========================
  const [data, setData] = useState({
    nama: '',
    gender: '',
    status: '',
    kewarganegaraan: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    alamat_rumah: '',
    no_hp: '',
    tujuan: '',
    gol_darah: '',
    agama: '',
  });

  const [errors, setErrors] = useState({});

  // ==========================
  // DATA ALAMAT
  // ==========================
  const [showAlamatRumah, setShowAlamatRumah] = useState(false);

  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [desaList, setDesaList] = useState([]);

  const [selectedProv, setSelectedProv] = useState('');
  const [selectedKab, setSelectedKab] = useState('');
  const [selectedKec, setSelectedKec] = useState('');
  const [selectedDesa, setSelectedDesa] = useState('');

  // ==========================
  // FETCH WILAYAH
  // ==========================
  useEffect(() => {
    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
      .then((r) => r.json())
      .then((d) => setProvinsiList(d));
  }, []);

  useEffect(() => {
    if (!selectedProv) return;
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv}.json`)
      .then((r) => r.json())
      .then((d) => setKabupatenList(d));
  }, [selectedProv]);

  useEffect(() => {
    if (!selectedKab) return;
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${selectedKab}.json`)
      .then((r) => r.json())
      .then((d) => setKecamatanList(d));
  }, [selectedKab]);

  useEffect(() => {
    if (!selectedKec) return;
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${selectedKec}.json`)
      .then((r) => r.json())
      .then((d) => setDesaList(d));
  }, [selectedKec]);

  // ==========================
  // VALIDASI
  // ==========================
  const validate = () => {
    let err = {};
    
    if (!data.nama) err.nama = 'Wajib diisi';
    if (!data.gender) err.gender = 'Wajib diisi';
    if (!data.status) err.status = 'Wajib diisi';
    if (!data.kewarganegaraan) err.kewarganegaraan = 'Wajib diisi';
    if (!data.tempat_lahir) err.tempat_lahir = 'Wajib diisi';
    if (!data.tanggal_lahir) err.tanggal_lahir = 'Wajib diisi';
    if (!data.alamat_rumah) err.alamat_rumah = 'Alamat rumah wajib dipilih';
    
    // Validasi No. HP (hanya angka, 10-13 digit)
    if (!data.no_hp) {
      err.no_hp = 'Wajib diisi';
    } else if (!/^\d+$/.test(data.no_hp)) {
      err.no_hp = 'Hanya boleh angka';
    } else if (data.no_hp.length < 10 || data.no_hp.length > 13) {
      err.no_hp = 'Panjang nomor 10-13 digit';
    }
    
    if (!data.tujuan) err.tujuan = 'Wajib diisi';
    if (!data.gol_darah) err.gol_darah = 'Wajib diisi';
    if (!data.agama) err.agama = 'Wajib diisi';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validasi No. HP hanya angka
    if (name === 'no_hp') {
      const numericValue = value.replace(/\D/g, '');
      setData({ ...data, [name]: numericValue });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  // ==========================
  // FORMAT TANGGAL LAHIR
  // ==========================
  const formatTanggalLahir = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleTanggalLahirChange = (e) => {
    setData({ ...data, tanggal_lahir: e.target.value });
  };

  // ==========================
  // SIMPAN DATA
  // ==========================
  const handleSave = async () => {
    if (!validate()) return;

    try {
      // Hitung umur dari tanggal lahir
      const tanggalLahir = new Date(data.tanggal_lahir);
      const today = new Date();
      const umur = today.getFullYear() - tanggalLahir.getFullYear();
      const monthDiff = today.getMonth() - tanggalLahir.getMonth();
      const calculatedUmur = monthDiff < 0 || (monthDiff === 0 && today.getDate() < tanggalLahir.getDate()) ? umur - 1 : umur;

      const dataToSend = {
        ...data,
        umur: calculatedUmur.toString(),
        hobi: '', // Set empty karena field dihapus
      };

      const res = await postStep(1, dataToSend);
      console.log('HASIL API:', res);

      localStorage.setItem('step1_done', 'true');
      localStorage.setItem('member_id', res.member_id);

      alert('Data berhasil disimpan!');
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    }
  };

  // ==========================
  // LANJUT KE STEP 2
  // ==========================
  const handleNextStep = () => {
    if (!validate()) {
      alert('Silakan lengkapi semua field yang wajib diisi');
      return;
    }

    // Simpan data ke localStorage saja, belum ke database
    localStorage.setItem('step1_data', JSON.stringify(data));
    navigate('/register/step2');
  };

  // ==========================
  // SIMPAN ALAMAT
  // ==========================
  const saveAlamat = async () => {
    if (!selectedProv || !selectedKab || !selectedKec || !selectedDesa) {
      alert('Semua data alamat wajib diisi!');
      return;
    }

    const provName = provinsiList.find((p) => p.id === selectedProv)?.name;
    const kabName = kabupatenList.find((k) => k.id === selectedKab)?.name;
    const kecName = kecamatanList.find((kec) => kec.id === selectedKec)?.name;
    const desaName = desaList.find((d) => d.id === selectedDesa)?.name;

    const fullAlamat = `${desaName}, ${kecName}, ${kabName}, ${provName}`;

    setData((prev) => ({ ...prev, alamat_rumah: fullAlamat }));
    setShowAlamatRumah(false);
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="bg-gray-50 h-screen overflow-hidden flex flex-col">
      {/* Header dengan icon back */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate("/register")}
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
            <span className="text-sm font-medium text-gray-700">Step 1 dari 4</span>
            <span className="text-sm font-medium text-gray-700">25%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00A5CF] h-2 rounded-full transition-all duration-300"
              style={{ width: "25%" }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* HEADER */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A5CF] to-[#0096D6] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                1
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Data Diri</h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">
              <span className="text-red-500">*</span> Menandakan field wajib diisi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NAMA */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                name="nama"
                value={data.nama}
                onChange={handleChange}
                type="text"
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.nama ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.nama && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.nama}</small>}
            </div>

            {/* JENIS KELAMIN */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Laki-laki"
                    checked={data.gender === 'Laki-laki'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#00A5CF] focus:ring-2 focus:ring-[#00A5CF] focus:ring-offset-0"
                  />
                  <span className="text-gray-700 text-sm">Laki-laki</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="Perempuan"
                    checked={data.gender === 'Perempuan'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#00A5CF] focus:ring-2 focus:ring-[#00A5CF] focus:ring-offset-0"
                  />
                  <span className="text-gray-700 text-sm">Perempuan</span>
                </label>
              </div>
              {errors.gender && <small className="text-red-500 mt-1 text-xs">{errors.gender}</small>}
            </div>

            {/* STATUS */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={data.status}
                onChange={handleChange}
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.status ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
              >
                <option value="">Pilih Status</option>
                <option value="Belum Menikah">Belum Menikah</option>
                <option value="Menikah">Menikah</option>
                <option value="Cerai">Cerai</option>
              </select>
              {errors.status && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.status}</small>}
            </div>

            {/* KEWARGANEGARAAN */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Kewarganegaraan <span className="text-red-500">*</span>
              </label>
              <input
                name="kewarganegaraan"
                value={data.kewarganegaraan}
                onChange={handleChange}
                type="text"
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.kewarganegaraan ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
                placeholder="Contoh: Indonesia"
              />
              {errors.kewarganegaraan && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.kewarganegaraan}</small>}
            </div>

            {/* TEMPAT LAHIR */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Tempat Lahir <span className="text-red-500">*</span>
              </label>
              <input
                name="tempat_lahir"
                value={data.tempat_lahir}
                onChange={handleChange}
                type="text"
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.tempat_lahir ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
                placeholder="Contoh: Jakarta"
              />
              {errors.tempat_lahir && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.tempat_lahir}</small>}
            </div>

            {/* TANGGAL LAHIR */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                name="tanggal_lahir"
                value={data.tanggal_lahir}
                onChange={handleTanggalLahirChange}
                type="date"
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.tanggal_lahir ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
              />
              {data.tanggal_lahir && (
                <small className="text-gray-500 mt-1.5 text-xs">
                  Format: {formatTanggalLahir(data.tanggal_lahir)}
                </small>
              )}
              {errors.tanggal_lahir && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.tanggal_lahir}</small>}
            </div>

            {/* NO. HP */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                No. HP <span className="text-red-500">*</span>
              </label>
              <input
                name="no_hp"
                value={data.no_hp}
                onChange={handleChange}
                type="text"
                maxLength={13}
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.no_hp ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
                placeholder="081234567890"
              />
              <small className="text-gray-500 mt-1.5 text-xs">Hanya angka, 10-13 digit</small>
              {errors.no_hp && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.no_hp}</small>}
          </div>

            {/* TUJUAN NEGARA */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Tujuan Negara <span className="text-red-500">*</span>
              </label>
              <select
                name="tujuan"
                value={data.tujuan}
                onChange={handleChange}
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.tujuan ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
              >
                <option value="">Pilih Tujuan Negara</option>
                <option value="Korea">Korea</option>
                <option value="Jepang">Jepang</option>
                <option value="Eropa">Eropa</option>
              </select>
              {errors.tujuan && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.tujuan}</small>}
        </div>

            {/* GOL DARAH */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Golongan Darah <span className="text-red-500">*</span>
              </label>
              <select
                name="gol_darah"
                value={data.gol_darah}
                onChange={handleChange}
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.gol_darah ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
              >
                <option value="">Pilih Golongan Darah</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
              {errors.gol_darah && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.gol_darah}</small>}
      </div>

            {/* AGAMA */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Agama <span className="text-red-500">*</span>
              </label>
              <select
                name="agama"
                value={data.agama}
                onChange={handleChange}
                className={`px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 ${errors.agama ? 'border-red-400 focus:ring-2 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-[#00A5CF]/20 focus:border-[#00A5CF] hover:border-gray-300'} outline-none bg-gray-50/50 focus:bg-white`}
              >
                <option value="">Pilih Agama</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
              {errors.agama && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.agama}</small>}
            </div>

            {/* ALAMAT RUMAH */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1.5 font-semibold text-sm">
                Alamat Rumah <span className="text-red-500">*</span>
              </label>
              <div 
                className={`px-4 py-3 text-sm rounded-xl border-2 cursor-pointer transition-all duration-200 ${errors.alamat_rumah ? 'border-red-400 hover:border-red-500' : 'border-gray-200 hover:border-[#00A5CF] focus-within:border-[#00A5CF]'} bg-gray-50/50 hover:bg-white`}
                onClick={() => setShowAlamatRumah(true)}
              >
                {data.alamat_rumah ? (
                  <span className="text-gray-700 text-sm">{data.alamat_rumah}</span>
                ) : (
                  <span className="text-gray-400 text-sm">
                    Klik untuk memilih alamat
                  </span>
                )}
              </div>
              {errors.alamat_rumah && <small className="text-red-500 mt-1.5 text-xs font-medium">{errors.alamat_rumah}</small>}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
            >
              Kembali
            </button>
            <button 
              type="button" 
              className="px-6 py-3 bg-[#00A5CF] hover:bg-[#0096D6] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={handleNextStep}
            >
              Lanjut
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* MODAL ALAMAT RUMAH */}
      {showAlamatRumah && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-xl font-bold mb-2 text-gray-900">Pilih Alamat Rumah</h2>
            <p className="text-sm text-gray-600 mb-6">
              Pilih Provinsi, Kabupaten/Kota, Kecamatan, dan Desa/Kelurahan untuk mengisi alamat lengkap
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Provinsi *</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none" 
                  value={selectedProv} 
                  onChange={(e) => {
                    setSelectedProv(e.target.value);
                    setSelectedKab('');
                    setSelectedKec('');
                    setSelectedDesa('');
                  }}
                >
              <option value="">Pilih Provinsi</option>
              {provinsiList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kabupaten/Kota *</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none disabled:bg-gray-100" 
                  value={selectedKab} 
                  onChange={(e) => {
                    setSelectedKab(e.target.value);
                    setSelectedKec('');
                    setSelectedDesa('');
                  }}
                  disabled={!selectedProv}
                >
                  <option value="">Pilih Kabupaten/Kota</option>
              {kabupatenList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan *</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none disabled:bg-gray-100" 
                  value={selectedKec} 
                  onChange={(e) => {
                    setSelectedKec(e.target.value);
                    setSelectedDesa('');
                  }}
                  disabled={!selectedKab}
                >
              <option value="">Pilih Kecamatan</option>
              {kecamatanList.map((kec) => (
                <option key={kec.id} value={kec.id}>
                  {kec.name}
                </option>
              ))}
            </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desa/Kelurahan *</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none disabled:bg-gray-100" 
                  value={selectedDesa} 
                  onChange={(e) => setSelectedDesa(e.target.value)}
                  disabled={!selectedKec}
                >
                  <option value="">Pilih Desa/Kelurahan</option>
              {desaList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-300" 
                onClick={() => setShowAlamatRumah(false)}
              >
                Batal
              </button>
              <button 
                type="button" 
                className="px-5 py-2.5 bg-[#00A5CF] hover:bg-[#0096D6] text-white rounded-lg font-medium transition-colors duration-300" 
                onClick={saveAlamat}
              >
                Simpan Alamat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
