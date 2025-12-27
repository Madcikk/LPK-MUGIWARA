import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const getDashboardRoute = () => {
    if (role === 'admin') return '/admin';
    if (role === 'mentor') return '/mentor/dashboard';
    return '/member';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={token ? <Navigate to={getDashboardRoute()} replace /> : <LandingDashboard />} 
        />
        <Route 
          path="/login" 
          element={token ? <Navigate to={getDashboardRoute()} replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={token ? <Navigate to={getDashboardRoute()} replace /> : <Register />} 
        />

        <Route path="/home" element={<Home />} />
        <Route path="/program" element={<Program />} />
        <Route path="/program_jepang" element={<Program_Jepang />} />
        <Route path="/program_korea" element={<Program_Korea />} />
        <Route path="/program_eropa" element={<Program_Eropa />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/kontak" element={<Kontak />} />
        <Route path="/register/mentor" element={<RegisterMentor />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/berita/:id" element={<DetailBerita />} />
        <Route path="/detail_program/jepang_deskripsi" element={<JepangDeskripsi />} />
        <Route path="/detail_program/korea_deskripsi" element={<KoreaDeskripsi />} />
        <Route path="/detail_program/eropa_deskripsi" element={<EropaDeskripsi />} />
        
        <Route path="/register/step1" element={<RegisterStep1 />} />
        <Route path="/register/step2" element={<RegisterStep2 />} />
        <Route path="/register/step3" element={<RegisterStep3 />} />
        <Route path="/register/step4" element={<RegisterStep4 />} />
        <Route path="/register/finish" element={<RegisterFinish />} />

        <Route 
          path="/member" 
          element={
            <PrivateRoute allowedRoles={['member']}>
              <MemberDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/member/dashboard" 
          element={
            <PrivateRoute allowedRoles={['member']}>
              <MemberAchievements />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/member/courses" 
          element={
            <PrivateRoute allowedRoles={['member']}>
              <MemberCourses />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/member/settings" 
          element={
            <PrivateRoute allowedRoles={['member']}>
              <MemberSettings />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/mentor/dashboard" 
          element={
            <PrivateRoute allowedRoles={['mentor']}>
              <DashboardMentor />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboardMentor" 
          element={
            <PrivateRoute allowedRoles={['mentor']}>
              <DashboardMentor />
            </PrivateRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}