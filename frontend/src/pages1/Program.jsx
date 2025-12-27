import React, { useState } from "react";

export default function Program() {
  const [open, setOpen] = useState(null);

  const toggle = (id) => {
    setOpen(open === id ? null : id);
  };

  return (
    <section id="program" className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">Program Kami</h2>

      <div className="space-y-4">

        {/* Program Jepang */}
        <div className="bg-white/90 p-6 rounded-xl shadow-md">
          <button
            className="w-full text-left font-semibold text-xl cursor-pointer"
            onClick={() => toggle(1)}
          >
            Program Jepang
          </button>

          {open === 1 && (
            <div className="mt-3 text-gray-700 text-sm">
              Pelatihan bahasa Jepang, persiapan ujian JLPT, dan pembekalan
              keterampilan kerja untuk industri Jepang.
            </div>
          )}
        </div>

        {/* Program Korea */}
        <div className="bg-white/90 p-6 rounded-xl shadow-md">
          <button
            className="w-full text-left font-semibold text-xl cursor-pointer"
            onClick={() => toggle(2)}
          >
            Program Korea
          </button>

          {open === 2 && (
            <div className="mt-3 text-gray-700 text-sm">
              Pelatihan EPS-TOPIK, bahasa Korea, dan sertifikasi untuk kerja
              di Korea Selatan.
            </div>
          )}
        </div>

        {/* Program Umum */}
        <div className="bg-white/90 p-6 rounded-xl shadow-md">
          <button
            className="w-full text-left font-semibold text-xl cursor-pointer"
            onClick={() => toggle(3)}
          >
            Program Umum
          </button>

          {open === 3 && (
            <div className="mt-3 text-gray-700 text-sm">
              Pelatihan soft skill, persiapan kerja, disiplin, dan wawancara.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
