import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingDashboard from "./pages1/LandingDashboard";
import Home from "./pages1/Home";
import Program from "./pages1/Program";
import Galeri from "./pages1/Galeri";
import Kontak from "./pages1/Kontak";
import Register from "./pages1/Register";
import RegisterMentor from "./pages1/RegisterMentor";
import Program_Jepang from "./pages1/Program_Jepang";
import Program_Korea from "./pages1/Program_Korea";
import Program_Eropa from "./pages1/Program_Eropa";
import AdminDashboard from "./pages1/AdminDashboard";
import Berita from "./pages1/Berita";
import DetailBerita from "./pages1/DetailBerita";
import Login from "./pages1/Login";
import MemberDashboard from "./pages1/MemberDashboard";
import MemberCourses from "./pages1/MemberCourses";
import MemberAchievements from "./pages1/MemberAchievements";
import MemberSettings from "./pages1/MemberSettings";
import RegisterStep1 from "./pages1/RegisterStep1";
import RegisterStep2 from "./pages1/RegisterStep2";
import RegisterStep3 from "./pages1/RegisterStep3";
import RegisterStep4 from "./pages1/RegisterStep4";
import RegisterFinish from "./pages1/RegisterFinish";

import JepangDeskripsi from "./pages1/detail_program/Jepang_deskripsi";
import KoreaDeskripsi from "./pages1/detail_program/Korea_deskripsi";
import EropaDeskripsi from "./pages1/detail_program/Eropa_deskripsi";

import DashboardMentor from "./pages1/mentor/DashboardMentor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingDashboard />} />
        <Route path="/home" element={<Home />} />

        {/* PROGRAM */}
        <Route path="/program" element={<Program />} />
        <Route path="/program_jepang" element={<Program_Jepang />} />
        <Route path="/program_korea" element={<Program_Korea />} />
        <Route path="/program_eropa" element={<Program_Eropa />} />

        {/* OTHER PAGES */}
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/mentor" element={<RegisterMentor />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<DetailBerita />} />
        <Route path="/login" element={<Login />} />
        <Route path="/member" element={<MemberDashboard />} />
        <Route path="/member/dashboard" element={<MemberAchievements />} />
        <Route path="/member/courses" element={<MemberCourses />} />
        <Route path="/member/settings" element={<MemberSettings />} />

        {/* REGISTER STEPS */}
        <Route path="/register/step1" element={<RegisterStep1 />} />
        <Route path="/register/step2" element={<RegisterStep2 />} />
        <Route path="/register/step3" element={<RegisterStep3 />} />
        <Route path="/register/step4" element={<RegisterStep4 />} />
        <Route path="/register/finish" element={<RegisterFinish />} />

        {/* DETAIL PROGRAM */}
        <Route path="/detail_program/jepang_deskripsi" element={<JepangDeskripsi />} />
        <Route path="/detail_program/korea_deskripsi" element={<KoreaDeskripsi />} />
        <Route path="/detail_program/eropa_deskripsi" element={<EropaDeskripsi />} />

        {/* MENTOR DASHBOARD */}
        <Route path="/mentor/dashboard" element={<DashboardMentor />} />
        <Route path="/dashboardMentor" element={<DashboardMentor />} />

      </Routes>
    </BrowserRouter>
  );
}
