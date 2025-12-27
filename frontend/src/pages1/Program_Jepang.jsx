import React from "react";
import { Link } from "react-router-dom";
import bg from "../assets/jepang.jpg";
import Navbar from "../pages1/components/Navbar";

export default function Program_Jepang() {
  return (
    <div className="bg-[#faf8f7] text-gray-800">
      
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section
        className="w-full min-h-screen px-6 flex flex-col items-center justify-center text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          Program Bahasa & Kerja ke Jepang 🇯🇵
        </h1>
        <p className="mt-4 max-w-2xl text-white text-lg md:text-xl drop-shadow-lg">
          Belajar bahasa Jepang dari dasar hingga lulus JLPT/JFT + pendampingan penempatan kerja
          ke perusahaan Jepang secara legal & resmi.
        </p>
      </section>

      {/* BENEFIT */}
      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Keunggulan Program
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { t: "Gaji 18–30 Juta / Bulan", d: "Kontrak legal & sesuai standar Jepang." },
            { t: "Kelas Intensif", d: "Belajar bahasa Jepang (N5–N3) dengan instruktur profesional." },
            { t: "Penempatan 100% Resmi", d: "Didampingi hingga keberangkatan ke Jepang." },
          ].map((v, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border shadow-lg">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">{v.t}</h3>
              <p>{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JENIS PROGRAM */}
      <section className="bg-white px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Jalur Program Jepang
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: "Tokutei Ginou (SSW)", desc: "Program kerja skill tertentu dengan peluang kontrak panjang." },
            { name: "Gino Jisshu (Magang)", desc: "Magang 3 tahun untuk memahami budaya kerja Jepang." },
            { name: "Caregiver (Kaigo)", desc: "Bidang perawat lansia, sangat dibutuhkan di Jepang." },
            { name: "Food & Factory", desc: "Pabrik makanan, manufaktur, maintenance operator." },
          ].map((p, i) => (
            <div key={i} className="p-6 rounded-2xl border shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-2xl font-semibold text-blue-600">{p.name}</h3>
              <p className="mt-2 text-gray-700">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SYARAT */}
      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-10">
          Persyaratan Pendaftaran
        </h2>
        <ul className="max-w-2xl mx-auto space-y-4 text-lg leading-relaxed">
          <li>• Usia 18–30 tahun</li>
          <li>• Laki-laki / Perempuan</li>
          <li>• Minimal lulusan SMA/SMK</li>
          <li>• Sehat jasmani & rohani (dibuktikan saat medis)</li>
          <li>• Siap mengikuti pelatihan bahasa Jepang</li>
        </ul>
      </section>

      {/* ALUR */}
      <section className="bg-[#fae3e3] px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Alur Pendaftaran & Keberangkatan
        </h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          {[
            "Pendaftaran Online",
            "Pelatihan Bahasa Jepang",
            "Tes & Interview",
            "Penempatan & Terbang",
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-4xl font-bold text-blue-600">{i + 1}</h3>
              <p className="mt-3 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAWAH */}
      <div className="py-20 text-center">
        <Link
          to="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl rounded-2xl font-bold shadow-lg transition-all"
        >
          Mulai Pendaftaran
        </Link>
      </div>
    </div>
  );
}
