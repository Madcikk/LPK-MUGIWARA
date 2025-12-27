import { useEffect, useState } from "react";
import "./DashboardMentor.css";

export default function DashboardMentor() {
  const token = localStorage.getItem("token");

  const [kelas, setKelas] = useState([]);
  const [activeKelas, setActiveKelas] = useState(null);
  const [tab, setTab] = useState("materi");

  const [materi, setMateri] = useState([]);
  const [tugas, setTugas] = useState([]);

  const [judulKelas, setJudulKelas] = useState("");
  const [judulMateri, setJudulMateri] = useState("");
  const [kontenMateri, setKontenMateri] = useState("");
  const [judulTugas, setJudulTugas] = useState("");

  /* LOAD KELAS */
  useEffect(() => {
    fetch("http://localhost:5000/api/mentor/kelas", {
      headers: { Authorization: "Bearer " + token },
    })
      .then(r => r.json())
      .then(setKelas);
  }, []);

  /* LOAD DETAIL */
  const loadDetail = async (kelasId) => {
    setActiveKelas(kelasId);

    const m = await fetch(`http://localhost:5000/api/mentor/materi/${kelasId}`, {
      headers: { Authorization: "Bearer " + token },
    }).then(r => r.json());

    const t = await fetch(`http://localhost:5000/api/mentor/tugas/${kelasId}`, {
      headers: { Authorization: "Bearer " + token },
    }).then(r => r.json());

    setMateri(m);
    setTugas(t);
  };

  /* ACTION */
  const tambahKelas = async () => {
    if (!judulKelas) return alert("Judul wajib");

    await fetch("http://localhost:5000/api/mentor/kelas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ judul: judulKelas, deskripsi: "" }),
    });

    setJudulKelas("");
    window.location.reload();
  };

  const tambahMateri = async () => {
    await fetch("http://localhost:5000/api/mentor/materi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        kelas_id: activeKelas,
        judul: judulMateri,
        konten: kontenMateri,
      }),
    });

    setJudulMateri("");
    setKontenMateri("");
    loadDetail(activeKelas);
  };

  const tambahTugas = async () => {
    await fetch("http://localhost:5000/api/mentor/tugas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        kelas_id: activeKelas,
        judul: judulTugas,
        deskripsi: "",
      }),
    });

    setJudulTugas("");
    loadDetail(activeKelas);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard Mentor</h1>

      {/* KELAS */}
      <div className="kelas-section">
        <input
          placeholder="Judul kelas baru"
          value={judulKelas}
          onChange={e => setJudulKelas(e.target.value)}
        />
        <button onClick={tambahKelas}>+ Tambah Kelas</button>
      </div>

      <div className="kelas-grid">
        {kelas.map(k => (
          <div
            key={k.id}
            className={`kelas-card ${activeKelas === k.id ? "active" : ""}`}
            onClick={() => loadDetail(k.id)}
          >
            <h3>{k.judul}</h3>
            <span>Klik untuk kelola</span>
          </div>
        ))}
      </div>

      {/* DETAIL */}
      {activeKelas && (
        <div className="detail">
          <div className="tabs">
            <button onClick={() => setTab("materi")} className={tab==="materi"?"active":""}>Materi</button>
            <button onClick={() => setTab("tugas")} className={tab==="tugas"?"active":""}>Tugas</button>
          </div>

          {/* MATERI */}
          {tab === "materi" && (
            <>
              <input
                placeholder="Judul materi"
                value={judulMateri}
                onChange={e => setJudulMateri(e.target.value)}
              />
              <textarea
                placeholder="Konten materi"
                value={kontenMateri}
                onChange={e => setKontenMateri(e.target.value)}
              />
              <button onClick={tambahMateri}>+ Simpan Materi</button>

              <ul>
                {materi.map(m => <li key={m.id}>{m.judul}</li>)}
              </ul>
            </>
          )}

          {/* TUGAS */}
          {tab === "tugas" && (
            <>
              <input
                placeholder="Judul tugas"
                value={judulTugas}
                onChange={e => setJudulTugas(e.target.value)}
              />
              <button onClick={tambahTugas}>+ Tambah Tugas</button>

              <ul>
                {tugas.map(t => <li key={t.id}>{t.judul}</li>)}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}