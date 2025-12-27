import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUpload, FiX, FiPlus } from "react-icons/fi";
import axios from "axios";

const BASEURL = "http://localhost:5000";

export default function RegisterMentor() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1: Biodata Diri
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [biodata, setBiodata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: ""
  });

  // Step 2: Pendidikan & Sertifikat
  const [pendidikan, setPendidikan] = useState([
    {
      tingkat: "",
      tingkat_lainnya: "",
      jurusan: "",
      universitas: "",
      tahun_masuk: "",
      tahun_lulus: "",
      ijazah_file: null,
      ijazah_preview: null
    }
  ]);

  const [sertifikat, setSertifikat] = useState([
    {
      nama_sertifikat: "",
      penerbit: "",
      tahun: "",
      file: null,
      file_preview: null
    }
  ]);

  // Step 3: Bahasa
  const [bahasa, setBahasa] = useState({
    bahasa_inggris: false,
    bahasa_korea: false,
    bahasa_jepang: false
  });

  const [tambahan, setTambahan] = useState({
    pengalaman_mengajar: "",
    alasan_menjadi_mentor: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle foto preview
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file maksimal 2MB");
        return;
      }
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle pendidikan
  const addPendidikan = () => {
    setPendidikan([
      ...pendidikan,
      {
        tingkat: "",
        tingkat_lainnya: "",
        jurusan: "",
        universitas: "",
        tahun_masuk: "",
        tahun_lulus: "",
        ijazah_file: null,
        ijazah_preview: null
      }
    ]);
  };

  const removePendidikan = (index) => {
    setPendidikan(pendidikan.filter((_, i) => i !== index));
  };

  const updatePendidikan = (index, field, value) => {
    const updated = [...pendidikan];
    updated[index][field] = value;
    setPendidikan(updated);
  };

  const handleIjazahChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      const updated = [...pendidikan];
      updated[index].ijazah_file = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        updated[index].ijazah_preview = reader.result;
        setPendidikan(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle sertifikat
  const addSertifikat = () => {
    setSertifikat([
      ...sertifikat,
      {
        nama_sertifikat: "",
        penerbit: "",
        tahun: "",
        file: null,
        file_preview: null
      }
    ]);
  };

  const removeSertifikat = (index) => {
    setSertifikat(sertifikat.filter((_, i) => i !== index));
  };

  const updateSertifikat = (index, field, value) => {
    const updated = [...sertifikat];
    updated[index][field] = value;
    setSertifikat(updated);
  };

  const handleSertifikatChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }
      const updated = [...sertifikat];
      updated[index].file = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        updated[index].file_preview = reader.result;
        setSertifikat(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validasi Step 1
  const validateStep1 = () => {
    const newErrors = {};
    if (!foto) newErrors.foto = "Foto profil wajib diupload";
    if (!biodata.name.trim()) newErrors.name = "Nama lengkap wajib diisi";
    if (!biodata.email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(biodata.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!biodata.password) newErrors.password = "Password wajib diisi";
    else if (biodata.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }
    if (biodata.password !== biodata.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }
    if (!biodata.phone.trim()) newErrors.phone = "No. Handphone wajib diisi";
    if (!biodata.tempat_lahir.trim()) newErrors.tempat_lahir = "Tempat lahir wajib diisi";
    if (!biodata.tanggal_lahir) newErrors.tanggal_lahir = "Tanggal lahir wajib diisi";
    if (!biodata.jenis_kelamin) newErrors.jenis_kelamin = "Jenis kelamin wajib dipilih";
    if (!biodata.alamat.trim()) newErrors.alamat = "Alamat wajib diisi";
    else if (biodata.alamat.trim().length < 10) {
      newErrors.alamat = "Alamat minimal 10 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validasi Step 2
  const validateStep2 = () => {
    const newErrors = {};
    
    // Validasi pendidikan
    pendidikan.forEach((p, index) => {
      if (!p.tingkat) newErrors[`pendidikan_${index}_tingkat`] = "Tingkat pendidikan wajib dipilih";
      if (p.tingkat === "Lainnya" && !p.tingkat_lainnya.trim()) {
        newErrors[`pendidikan_${index}_tingkat_lainnya`] = "Tingkat lainnya wajib diisi";
      }
      if (!p.jurusan.trim()) newErrors[`pendidikan_${index}_jurusan`] = "Jurusan wajib diisi";
      if (!p.universitas.trim()) newErrors[`pendidikan_${index}_universitas`] = "Universitas wajib diisi";
      if (!p.tahun_lulus) newErrors[`pendidikan_${index}_tahun_lulus`] = "Tahun lulus wajib diisi";
      if (!p.ijazah_file) newErrors[`pendidikan_${index}_ijazah`] = "Ijazah wajib diupload";
    });

    // Validasi pendidikan terakhir minimal S1 atau D3
    if (pendidikan.length > 0) {
      const pendidikanTerakhir = pendidikan[0];
      if (pendidikanTerakhir.tingkat !== "S1" && pendidikanTerakhir.tingkat !== "D3") {
        newErrors.pendidikan_minimal = "Pendidikan terakhir minimal S1 atau D3";
      }
    }

    // Validasi sertifikat
    sertifikat.forEach((s, index) => {
      if (!s.nama_sertifikat.trim()) newErrors[`sertifikat_${index}_nama`] = "Nama sertifikat wajib diisi";
      if (!s.penerbit.trim()) newErrors[`sertifikat_${index}_penerbit`] = "Penerbit wajib diisi";
      if (!s.tahun) newErrors[`sertifikat_${index}_tahun`] = "Tahun wajib diisi";
      if (!s.file) newErrors[`sertifikat_${index}_file`] = "File sertifikat wajib diupload";
    });

    if (sertifikat.length === 0) {
      newErrors.sertifikat_minimal = "Minimal 1 sertifikat wajib diupload";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validasi Step 3
  const validateStep3 = () => {
    const newErrors = {};
    if (!bahasa.bahasa_inggris && !bahasa.bahasa_korea && !bahasa.bahasa_jepang) {
      newErrors.bahasa = "Pilih minimal 1 bahasa yang akan diajarkan";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    try {
      // Prepare pendidikan data (tanpa file, karena file akan diupload terpisah)
      const pendidikanData = pendidikan.map((p) => ({
        tingkat: p.tingkat,
        tingkat_lainnya: p.tingkat_lainnya || null,
        jurusan: p.jurusan,
        universitas: p.universitas,
        tahun_masuk: p.tahun_masuk || null,
        tahun_lulus: p.tahun_lulus
      }));

      // Prepare sertifikat data (tanpa file)
      const sertifikatData = sertifikat.map((s) => ({
        nama_sertifikat: s.nama_sertifikat,
        penerbit: s.penerbit,
        tahun: s.tahun
      }));

      // Submit registrasi dengan semua file
      const formData = new FormData();
      formData.append("foto", foto);
      formData.append("name", biodata.name);
      formData.append("email", biodata.email);
      formData.append("password", biodata.password);
      formData.append("phone", biodata.phone);
      formData.append("tempat_lahir", biodata.tempat_lahir);
      formData.append("tanggal_lahir", biodata.tanggal_lahir);
      formData.append("jenis_kelamin", biodata.jenis_kelamin);
      formData.append("alamat", biodata.alamat);
      formData.append("bahasa_inggris", bahasa.bahasa_inggris);
      formData.append("bahasa_korea", bahasa.bahasa_korea);
      formData.append("bahasa_jepang", bahasa.bahasa_jepang);
      formData.append("pengalaman_mengajar", tambahan.pengalaman_mengajar || "");
      formData.append("alasan_menjadi_mentor", tambahan.alasan_menjadi_mentor || "");
      formData.append("pendidikan", JSON.stringify(pendidikanData));
      formData.append("sertifikat", JSON.stringify(sertifikatData));

      // Append all ijazah files
      pendidikan.forEach((p, i) => {
        if (p.ijazah_file) {
          formData.append(`ijazah_${i}`, p.ijazah_file);
        }
      });

      // Append all sertifikat files
      sertifikat.forEach((s, i) => {
        if (s.file) {
          formData.append(`sertifikat_${i}`, s.file);
        }
      });

      const res = await axios.post(`${BASEURL}/api/mentor/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Registrasi berhasil! Pendaftaran sedang dalam proses review.");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err);
      alert(err.response?.data?.error || "Terjadi kesalahan saat registrasi");
    } finally {
      setLoading(false);
    }
  };

  // Render Step 1
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Biodata Diri</h2>

      {/* Foto Profil */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto Profil <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          {fotoPreview && (
            <div className="relative">
              <img src={fotoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
              <button
                type="button"
                onClick={() => {
                  setFoto(null);
                  setFotoPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
            <FiUpload className="w-5 h-5" />
            <span>{foto ? "Ganti Foto" : "Upload Foto"}</span>
            <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
          </label>
        </div>
        {errors.foto && <p className="text-red-500 text-sm mt-1">{errors.foto}</p>}
        <p className="text-gray-500 text-xs mt-1">Max 2MB, format JPG/PNG</p>
      </div>

      {/* Nama Lengkap */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Lengkap <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={biodata.name}
          onChange={(e) => setBiodata({ ...biodata, name: e.target.value })}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
          placeholder="Masukkan nama lengkap"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={biodata.email}
          onChange={(e) => setBiodata({ ...biodata, email: e.target.value })}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
          placeholder="contoh@email.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={biodata.password}
            onChange={(e) => setBiodata({ ...biodata, password: e.target.value })}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
            placeholder="Minimal 8 karakter"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konfirmasi Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={biodata.confirmPassword}
            onChange={(e) => setBiodata({ ...biodata, confirmPassword: e.target.value })}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
            placeholder="Ulangi password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      {/* No. Handphone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          No. Handphone <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          value={biodata.phone}
          onChange={(e) => setBiodata({ ...biodata, phone: e.target.value })}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
          placeholder="081234567890"
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {/* Tempat, Tanggal Lahir */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempat Lahir <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={biodata.tempat_lahir}
            onChange={(e) => setBiodata({ ...biodata, tempat_lahir: e.target.value })}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
            placeholder="Kota/Kabupaten"
          />
          {errors.tempat_lahir && <p className="text-red-500 text-sm mt-1">{errors.tempat_lahir}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Lahir <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={biodata.tanggal_lahir}
            onChange={(e) => setBiodata({ ...biodata, tanggal_lahir: e.target.value })}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
          />
          {errors.tanggal_lahir && <p className="text-red-500 text-sm mt-1">{errors.tanggal_lahir}</p>}
        </div>
      </div>

      {/* Jenis Kelamin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis Kelamin <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="jenis_kelamin"
              value="L"
              checked={biodata.jenis_kelamin === "L"}
              onChange={(e) => setBiodata({ ...biodata, jenis_kelamin: e.target.value })}
              className="w-4 h-4 text-[#00A5CF]"
            />
            <span>Laki-laki</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="jenis_kelamin"
              value="P"
              checked={biodata.jenis_kelamin === "P"}
              onChange={(e) => setBiodata({ ...biodata, jenis_kelamin: e.target.value })}
              className="w-4 h-4 text-[#00A5CF]"
            />
            <span>Perempuan</span>
          </label>
        </div>
        {errors.jenis_kelamin && <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin}</p>}
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat Lengkap <span className="text-red-500">*</span>
        </label>
        <textarea
          value={biodata.alamat}
          onChange={(e) => setBiodata({ ...biodata, alamat: e.target.value })}
          rows={3}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
          placeholder="Masukkan alamat lengkap"
        />
        {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
      </div>
    </div>
  );

  // Render Step 2
  const renderStep2 = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Pendidikan & Sertifikat</h2>

      {/* Pendidikan */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Pendidikan</h3>
        {pendidikan.map((p, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">
                Pendidikan {index + 1} {index === 0 && <span className="text-red-500">*</span>}
              </h4>
              {pendidikan.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePendidikan(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tingkat Pendidikan <span className="text-red-500">*</span>
                </label>
                <select
                  value={p.tingkat}
                  onChange={(e) => updatePendidikan(index, "tingkat", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                >
                  <option value="">Pilih Tingkat</option>
                  <option value="SMA">SMA</option>
                  <option value="D3">D3</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {errors[`pendidikan_${index}_tingkat`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`pendidikan_${index}_tingkat`]}</p>
                )}
              </div>

              {p.tingkat === "Lainnya" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat Lainnya <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={p.tingkat_lainnya}
                    onChange={(e) => updatePendidikan(index, "tingkat_lainnya", e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                    placeholder="Masukkan tingkat pendidikan"
                  />
                  {errors[`pendidikan_${index}_tingkat_lainnya`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`pendidikan_${index}_tingkat_lainnya`]}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={p.jurusan}
                  onChange={(e) => updatePendidikan(index, "jurusan", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                  placeholder="Contoh: Sastra Jepang"
                />
                {errors[`pendidikan_${index}_jurusan`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`pendidikan_${index}_jurusan`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Universitas/Institusi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={p.universitas}
                  onChange={(e) => updatePendidikan(index, "universitas", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                  placeholder="Nama universitas"
                />
                {errors[`pendidikan_${index}_universitas`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`pendidikan_${index}_universitas`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Masuk</label>
                <input
                  type="number"
                  value={p.tahun_masuk}
                  onChange={(e) => updatePendidikan(index, "tahun_masuk", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                  placeholder="YYYY"
                  min="1950"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun Lulus <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={p.tahun_lulus}
                  onChange={(e) => updatePendidikan(index, "tahun_lulus", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                  placeholder="YYYY"
                  min="1950"
                  max={new Date().getFullYear()}
                />
                {errors[`pendidikan_${index}_tahun_lulus`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`pendidikan_${index}_tahun_lulus`]}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ijazah <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {p.ijazah_preview && (
                    <div className="relative">
                      <img src={p.ijazah_preview} alt="Preview" className="w-32 h-40 object-cover rounded border-2 border-gray-200" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...pendidikan];
                          updated[index].ijazah_file = null;
                          updated[index].ijazah_preview = null;
                          setPendidikan(updated);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                    <FiUpload className="w-5 h-5" />
                    <span>{p.ijazah_file ? "Ganti File" : "Upload Ijazah"}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleIjazahChange(index, e)}
                      className="hidden"
                    />
                  </label>
                </div>
                {errors[`pendidikan_${index}_ijazah`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`pendidikan_${index}_ijazah`]}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Max 5MB, format PDF/Image</p>
              </div>
            </div>
          </div>
        ))}

        {errors.pendidikan_minimal && (
          <p className="text-red-500 text-sm mt-2">{errors.pendidikan_minimal}</p>
        )}

        <button
          type="button"
          onClick={addPendidikan}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Tambah Pendidikan Lainnya</span>
        </button>
      </div>

      {/* Sertifikat */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sertifikat Skill / Kompetensi</h3>
        {sertifikat.map((s, index) => (
          <div key={index} className="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">
                Sertifikat {index + 1} <span className="text-red-500">*</span>
              </h4>
              {sertifikat.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSertifikat(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Sertifikat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={s.nama_sertifikat}
                  onChange={(e) => updateSertifikat(index, "nama_sertifikat", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                  placeholder="Contoh: JLPT N2"
                />
                {errors[`sertifikat_${index}_nama`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`sertifikat_${index}_nama`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Penerbit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={s.penerbit}
                  onChange={(e) => updateSertifikat(index, "penerbit", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                  placeholder="Nama penerbit"
                />
                {errors[`sertifikat_${index}_penerbit`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`sertifikat_${index}_penerbit`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={s.tahun}
                  onChange={(e) => updateSertifikat(index, "tahun", e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
                  placeholder="YYYY"
                  min="1950"
                  max={new Date().getFullYear()}
                />
                {errors[`sertifikat_${index}_tahun`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`sertifikat_${index}_tahun`]}</p>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Sertifikat <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  {s.file_preview && (
                    <div className="relative">
                      <img src={s.file_preview} alt="Preview" className="w-32 h-40 object-cover rounded border-2 border-gray-200" />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...sertifikat];
                          updated[index].file = null;
                          updated[index].file_preview = null;
                          setSertifikat(updated);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
                    <FiUpload className="w-5 h-5" />
                    <span>{s.file ? "Ganti File" : "Upload Sertifikat"}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleSertifikatChange(index, e)}
                      className="hidden"
                    />
                  </label>
                </div>
                {errors[`sertifikat_${index}_file`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`sertifikat_${index}_file`]}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Max 5MB, format PDF/Image</p>
              </div>
            </div>
          </div>
        ))}

        {errors.sertifikat_minimal && (
          <p className="text-red-500 text-sm mt-2">{errors.sertifikat_minimal}</p>
        )}

        <button
          type="button"
          onClick={addSertifikat}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Tambah Sertifikat Lainnya</span>
        </button>
      </div>
    </div>
  );

  // Render Step 3
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bahasa yang akan diajarkan</h2>

      {/* Bahasa */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Pilih Bahasa <span className="text-red-500">*</span> (Pilih minimal 1, bisa pilih beberapa)
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#00A5CF] transition-colors">
            <input
              type="checkbox"
              checked={bahasa.bahasa_inggris}
              onChange={(e) => setBahasa({ ...bahasa, bahasa_inggris: e.target.checked })}
              className="w-5 h-5 text-[#00A5CF] rounded"
            />
            <span className="font-medium text-gray-900">Bahasa Inggris</span>
          </label>
          <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#00A5CF] transition-colors">
            <input
              type="checkbox"
              checked={bahasa.bahasa_korea}
              onChange={(e) => setBahasa({ ...bahasa, bahasa_korea: e.target.checked })}
              className="w-5 h-5 text-[#00A5CF] rounded"
            />
            <span className="font-medium text-gray-900">Bahasa Korea</span>
          </label>
          <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#00A5CF] transition-colors">
            <input
              type="checkbox"
              checked={bahasa.bahasa_jepang}
              onChange={(e) => setBahasa({ ...bahasa, bahasa_jepang: e.target.checked })}
              className="w-5 h-5 text-[#00A5CF] rounded"
            />
            <span className="font-medium text-gray-900">Bahasa Jepang</span>
          </label>
        </div>
        {errors.bahasa && <p className="text-red-500 text-sm mt-2">{errors.bahasa}</p>}
      </div>

      {/* Pengalaman Mengajar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pengalaman Mengajar (Opsional)
        </label>
        <textarea
          value={tambahan.pengalaman_mengajar}
          onChange={(e) => setTambahan({ ...tambahan, pengalaman_mengajar: e.target.value })}
          rows={4}
          maxLength={500}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
          placeholder="Jelaskan pengalaman mengajar bahasa atau pengalaman relevan lainnya..."
        />
        <p className="text-gray-500 text-xs mt-1">{tambahan.pengalaman_mengajar.length}/500 karakter</p>
      </div>

      {/* Alasan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alasan ingin menjadi mentor (Opsional)
        </label>
        <textarea
          value={tambahan.alasan_menjadi_mentor}
          onChange={(e) => setTambahan({ ...tambahan, alasan_menjadi_mentor: e.target.value })}
          rows={4}
          maxLength={500}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00A5CF] focus:border-[#00A5CF] outline-none"
          placeholder="Jelaskan alasan Anda ingin menjadi mentor..."
        />
        <p className="text-gray-500 text-xs mt-1">{tambahan.alasan_menjadi_mentor.length}/500 karakter</p>
      </div>
    </div>
  );

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

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
            <span className="text-sm font-medium text-gray-700">Step {step} dari 3</span>
            <span className="text-sm font-medium text-gray-700">{Math.round((step / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#00A5CF] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrev}
              // disabled={step === 1}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                step === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Kembali
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-[#00A5CF] hover:bg-[#0096D6] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Lanjut
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Mengirim..." : "Submit Pendaftaran"}
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

