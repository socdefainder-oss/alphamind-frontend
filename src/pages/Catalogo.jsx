import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import "../App.css";

function Catalogo() {
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [cursosMatriculados, setCursosMatriculados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Carregar cursos disponíveis
      const cursosRes = await api.get("/api/aluno/cursos");
      setCursos(cursosRes.data);

      // Carregar cursos já matriculados
      const matriculasRes = await api.get("/api/aluno/minhas-matriculas");
      setCursosMatriculados(matriculasRes.data.map(m => m.id));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMatricular(cursoId) {
    if (!confirm("Deseja se matricular neste curso?")) return;

    try {
      await api.post(`/api/aluno/matricular/${cursoId}`);
      alert("Matrícula realizada com sucesso!");
      loadData(); // Recarregar dados
    } catch (error) {
      console.error("Erro ao matricular:", error);
      alert(error.response?.data?.error || "Erro ao realizar matrícula");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function isMatriculado(cursoId) {
    return cursosMatriculados.includes(cursoId);
  }

  if (loading || isLoading) {
    return <div className="shell"><div className="main"><div className="main-inner">Carregando...</div></div></div>;
  }

  return (
    <div className="shell">
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-badge" />
            <div>
              <div>Instituto AlphaMind</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                Transformação através do conhecimento
              </div>
            </div>
          </div>

          <nav className="nav">
            <a href="/dashboard">Home</a>
            <a href="/jornada">Jornada</a>
            <a href="/meus-cursos">Cursos</a>
            <a href="/catalogo" style={{ background: "rgba(255,255,255,0.10)" }}>
              Catálogo
            </a>
            <a href="/provas">Provas</a>
            <a href="/avisos">Avisos</a>
            <a href="/perfil">Perfil</a>

            <button className="btn btn-ghost" onClick={logout}>
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="main-inner" style={{ gridTemplateColumns: "1fr" }}>
          {/* Hero */}
          <div className="hero">
            <h1>Catálogo de Cursos</h1>
            <p>
              Explore todos os cursos disponíveis e matricule-se nos que mais interessam.
            </p>
          </div>

          {/* Grid de Cursos */}
          <div className="grid" style={{ marginTop: 24 }}>
            {cursos.length === 0 ? (
              <div className="card span-12">
                <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0" }}>
                  Nenhum curso disponível no momento.
                </p>
              </div>
            ) : (
              cursos.map(curso => {
                const matriculado = isMatriculado(curso.id);
                
                return (
                  <div key={curso.id} className="card span-4">
                    <div style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          height: 120,
                          borderRadius: 12,
                          background: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 48,
                          fontWeight: 900,
                        }}
                      >
                        📚
                      </div>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>
                      {curso.titulo}
                    </h3>

                    <p style={{ fontSize: 14, color: "#64748b", marginBottom: 14, lineHeight: 1.5 }}>
                      {curso.descricao || "Descrição não disponível"}
                    </p>

                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 14 }}>
                      <div>📑 {curso.total_modulos || 0} módulos</div>
                      <div>📝 {curso.total_aulas || 0} aulas</div>
                      <div>⏱️ {Math.round((curso.duracao_total_minutos || 0) / 60)} horas</div>
                      {curso.preco_total && (
                        <div style={{ fontWeight: 700, color: "#10b981", marginTop: 8 }}>
                          R$ {parseFloat(curso.preco_total).toFixed(2)}
                        </div>
                      )}
                    </div>

                    {matriculado ? (
                      <button
                        className="btn btn-primary"
                        style={{ 
                          width: "100%",
                          background: "#10b981",
                          cursor: "default"
                        }}
                        onClick={() => navigate(`/curso/${curso.id}`)}
                      >
                        ✓ Matriculado - Acessar
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={() => handleMatricular(curso.id)}
                      >
                        Matricular-se
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Catalogo;
