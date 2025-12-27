import React from "react";
import Navbar from "./components/Navbar";
import bg from "./components/aset/bg.jpg";

export default function LandingDashboard() {
  return (
    <div className="w-full min-h-screen relative overflow-hidden">

      {/* BACKGROUND (KIRIM KE BELAKANG) */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${bg})`, backgroundAttachment: "fixed" }}
      />

      {/* OVERLAY GELAP DENGAN BLUR */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] -z-10" />

      <Navbar />

      {/* HERO */}
      <main className="relative z-10 max-w-7xl mx-auto h-screen flex items-center">
        <div className="px-6 text-white">
          <p className="text-white text-sm md:text-lg mb-3">
            Lembaga Pelatihan Kerja Ke Luar Negeri
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            LPK MUGIWARA
          </h1>

          <p className="max-w-xl mb-6 opacity-90">
            Program pelatihan terjangkau & terpercaya untuk persiapan bekerja di
            luar negeri. Kursus bahasa, keterampilan kerja, dan pembekalan
            keberangkatan.
          </p>

          <a
            href="/register"
            className="inline-flex items-center gap-3 bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
          >
            Daftar Online
          </a>
        </div>
      </main>

      {/* ============================
          SECTION: SIAPA KAMI
      ============================= */}
      <section className="bg-white py-20 relative z-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-blue-700 text-2xl font-bold mb-4">Siapa Kami</h2>
          <p className="text-gray-700 leading-relaxed">
            LPK Mugiwara adalah lembaga pelatihan kerja dan pelatihan bahasa
            asing yang berkomitmen untuk mencetak generasi muda yang kompeten.
            Agar supaya siswa yang lulus dari lembaga kami mampu bersaing di
            dunia kerja internasional, baik di Jepang, Korea, maupun Eropa.
          </p>
        </div>
      </section>

      {/* ============================
          SECTION: VISI & MISI
      ============================= */}
      <section className="bg-white pb-20 relative z-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">

          {/* VISI */}
          <div>
            <h3 className="text-center text-blue-700 text-lg font-bold mb-4">
              Visi
            </h3>
            <p className="text-gray-700 leading-relaxed text-justify">
              Meyakini bahwa pendidikan dan kesempatan bekerja di luar negeri
              dapat membuka jalan bagi peningkatan kualitas hidup dan masa depan
              yang lebih baik. Dengan pendekatan profesional dan berorientasi
              pada hasil, kami mendorong Mugiwara Learning Centre menjadi
              lembaga yang kredibel, terpercaya, dan berdampak bagi masyarakat.
            </p>
          </div>

          {/* MISI */}
          <div>
            <h3 className="text-center text-blue-700 text-lg font-bold mb-4">
              Misi
            </h3>
            <ul className="text-gray-700 leading-relaxed list-decimal pl-6">
              <li>
                Memberikan pelatihan bahasa Jepang, Inggris, dan Korea sesuai
                standar kebutuhan kerja maupun studi di luar negeri.
              </li>
              <li>
                Membangun karakter disiplin, jujur, dan bertanggung jawab serta
                etos kerja yang dibutuhkan oleh dunia industri internasional.
              </li>
              <li>
                Menyediakan bimbingan karir serta informasi peluang kerja/studi
                ke Jepang, Korea, dan Eropa secara transparan dan akurat.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ============================
          SECTION: LOKASI MAPS
      ============================= */}
      <section className="bg-white py-12 relative z-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-4">
            Lokasi Kami
          </h2>
          <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto text-sm">
            Kunjungi kantor kami di Kuniran, Kabupaten Ngawi, Jawa Timur
          </p>
          
          <div className="rounded-lg overflow-hidden shadow-md border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.5!2d111.5!3d-7.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMjQnMDAuMCJTIDExMcKwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1234567890123!5m2!1sid!2sid&q=Kuniran+Kabupaten+Ngawi+Jawa+Timur"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi LPK Mugiwara"
              className="w-full"
            ></iframe>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-700 font-medium mb-1 text-sm">Alamat:</p>
            <p className="text-gray-600 text-sm">
              Kuniran, Kabupaten Ngawi, Jawa Timur
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Kuniran+Kabupaten+Ngawi+Jawa+Timur"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-[#00A5CF] hover:text-[#0096D6] transition-colors duration-300 font-medium text-sm"
            >
              Buka di Google Maps →
            </a>
          </div>
        </div>
      </section>

      {/* ============================
          SECTION: WHATSAPP SUPPORT
      ============================= */}
      <section className="bg-blue-700 py-16 text-center text-white relative z-20">
        <h3 className="text-lg font-semibold mb-2">
          Staff kami siap membantu Anda!
        </h3>
        <p className="mb-6">Whatsapp:</p>

        <a
          href="https://wa.me/6282341998356"
          target="_blank"
          className="inline-flex items-center gap-3 bg-white text-green-600 px-6 py-3 rounded-full shadow-lg font-bold hover:bg-gray-100 transition"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="wa"
            className="w-7 h-7"
          />
          Hubungi via WhatsApp
        </a>
      </section>
    </div>
  );
}
