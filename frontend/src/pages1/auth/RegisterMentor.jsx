import { useState } from "react";
import "./RegisterMentor.css";

export default function RegisterMentor() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    keahlian: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.email || !form.password) {
      return alert("Lengkapi data wajib!");
    }

    setLoading(true);

    const res = await fetch("http://localhost:5000/auth/register-mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Pendaftaran mentor berhasil!");
      window.location.href = "/mentor/dashboard";
    } else {
      alert(data.message || "Gagal mendaftar");
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit}>
        <h1>Daftar sebagai Mentor</h1>
        <p>Bagikan ilmu & kelola kelas Anda</p>

        <input
          name="nama"
          placeholder="Nama Lengkap"
          value={form.nama}
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          name="keahlian"
          placeholder="Bidang Keahlian (ex: Web Development)"
          value={form.keahlian}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Bio singkat mentor"
          value={form.bio}
          onChange={handleChange}
        />

        <button disabled={loading}>
          {loading ? "Mendaftar..." : "Daftar Mentor"}
        </button>

        <span className="footer-text">
          Sudah punya akun? <a href="/login">Login</a>
        </span>
      </form>
    </div>
  );
}