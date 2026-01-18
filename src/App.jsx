import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jornada from "./pages/Jornada";
import MeusCursos from "./pages/MeusCursos";
import Provas from "./pages/Provas";
import Avisos from "./pages/Avisos";
import Perfil from "./pages/Perfil";
import AdminCursos from "./pages/AdminCursos";
import AdminModulos from "./pages/AdminModulos";
import AdminAulas from "./pages/AdminAulas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Privadas (validação por token dentro das páginas) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jornada" element={<Jornada />} />
        <Route path="/meus-cursos" element={<MeusCursos />} />
        <Route path="/provas" element={<Provas />} />
        <Route path="/avisos" element={<Avisos />} />
        <Route path="/perfil" element={<Perfil />} />

        {/* Admin */}
        <Route path="/admin/cursos" element={<AdminCursos />} />
        <Route path="/admin/cursos/:cursoId/modulos" element={<AdminModulos />} />
        <Route path="/admin/modulos/:moduloId/aulas" element={<AdminAulas />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
