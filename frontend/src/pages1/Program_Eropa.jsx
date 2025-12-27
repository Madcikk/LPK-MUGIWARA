import React from "react";
import { Link } from "react-router-dom";
import bg from "../assets/eropa.jpg";
import Navbar from "../pages1/components/Navbar";

export default function Program_Eropa() {
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
          Program Kerja & Studi ke Eropa 🇪🇺
        </h1>
        <p className="mt-4 max-w-2xl text-white text-lg md:text-xl drop-shadow-lg">
          Kesempatan emas kerja & studi ke berbagai negara Eropa melalui jalur resmi,
          legal dan pendampingan hingga berangkat.
        </p>
      </section>

      {/* BENEFIT */}
      <section className="px-6 md:px-16 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-12">
          Keunggulan Program
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { t: "Gaji 30–70 Juta / Bulan", d: "Standar gaji tinggi dengan jaminan sosial & sistem kerja Eropa." },
            { t: "Visa Kerja / Visa Studi", d: "Tersedia jalur kerja & jalur kuliah Eropa sesuai minat peserta." },
            { t: "Pendampingan Legal 100%", d: "Mulai dokumen, kontrak, hingga akomodasi saat tiba di negara tujuan." },
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
          Jalur Program Eropa
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: "Working Visa (Kerja)", desc: "Bekerja di bidang hospitality, industri, caregiver, warehouse, dll." },
            { name: "Study & Work", desc: "Kuliah sambil bekerja di universitas Eropa (Jerman, Polandia, Prancis, dll)." },
            { name: "Hospitality", desc: "Hotel & restoran dengan standar kerja internasional + tips tinggi." },
            { name: "Perawat / Caregiver", desc: "Gaji tinggi dengan peluang mendapatkan izin tinggal permanen." },
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
          <li>• Usia 18–45 tahun</li>
          <li>• Laki-laki / Perempuan</li>
          <li>• Pendidikan minimal SMA/SMK (S1 untuk jalur Study Work lebih diutamakan)</li>
          <li>• Tidak sedang bermasalah secara hukum</li>
          <li>• Siap mengikuti pelatihan bahasa & persiapan keberangkatan</li>
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
            "Pelatihan Bahasa & Dokumen",
            "Interview & Visa",
            "Kontrak Kerja & Terbang",
          ].map((step, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-4xl font-bold text-blue-600">{i + 1}</h3>
              <p className="mt-3 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
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
