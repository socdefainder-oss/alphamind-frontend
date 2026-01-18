import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import "../App.css";

function MeusCursos() {
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeusCursos();
  }, []);

  async function loadMeusCursos() {
    try {
      const response = await api.get("/api/aluno/minhas-matriculas");
      console.log("Cursos recebidos:", response.data);
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      console.error("Detalhes do erro:", error.response?.data);
    } finally {
      setLoading(false);
    }
  }

  const resumo = useMemo(() => {
    return {
      emAndamento: cursos.filter(c => parseFloat(c.progresso_percentual) > 0 && parseFloat(c.progresso_percentual) < 100).length,
      naFila: cursos.filter(c => parseFloat(c.progresso_percentual) === 0).length,
      concluidos: cursos.filter(c => parseFloat(c.progresso_percentual) === 100).length,
    };
  }, [cursos]);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: 18,
        color: "#64748b"
      }}>
        Verificando autenticação...
      </div>
    );
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function voltarDashboard() {
    navigate("/dashboard");
  }

  function getStatusLabel(progresso) {
    const prog = parseFloat(progresso);
    if (prog === 0) return "NA FILA";
    if (prog === 100) return "CONCLUÍDO";
    return "EM ANDAMENTO";
  }

  function getStatusColor(progresso) {
    const prog = parseFloat(progresso);
    if (prog === 0) return "#94a3b8";
    if (prog === 100) return "#10b981";
    return "#f59e0b";
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
            <div className="brand-badge">
              <img src="/logo.png" alt="AlphaMind" />
            </div>
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
            <a href="/meus-cursos" style={{ background: "rgba(255,255,255,0.10)" }}>
              Cursos
            </a>
            <a href="/provas">Provas</a>
            <a href="/avisos">Avisos</a>
            <a href="/perfil">Perfil</a>

            <button className="btn btn-ghost" onClick={logout}>
              Sair
            </button>

            <button className="btn btn-primary" onClick={voltarDashboard}>
              Voltar
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="main-inner" style={{ gridTemplateColumns: "1fr" }}>
          {/* Hero */}
          <div className="hero">
            <h1>Meus Cursos</h1>
            <p>
              Aqui estão todos os cursos que você já iniciou, concluiu ou fará em breve.
            </p>
          </div>

          {/* Resumo */}
          <div className="grid" style={{ marginTop: 14 }}>
            <div className="card span-4">
              <h3>Em andamento</h3>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{resumo.emAndamento}</div>
            </div>

            <div className="card span-4">
              <h3>Na fila</h3>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{resumo.naFila}</div>
            </div>

            <div className="card span-4">
              <h3>Concluídos</h3>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{resumo.concluidos}</div>
            </div>

            {/* Lista de cursos */}
            <div className="card span-12">
              <h3>Lista de cursos</h3>
              <p>Visão detalhada da sua jornada acadêmica.</p>

              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
                {cursos.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0" }}>
                    Você ainda não está matriculado em nenhum curso.
                  </p>
                ) : (
                  cursos.map(curso => (
                    <div
                      key={curso.matricula_id}
                      style={{
                        border: "1px solid rgba(15,23,42,0.12)",
                        borderRadius: 16,
                        padding: 16,
                        background: "#fff",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 900, fontSize: 16 }}>
                            {curso.titulo}
                          </div>
                          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                            Status: <b style={{ color: getStatusColor(curso.progresso_percentual) }}>
                              {getStatusLabel(curso.progresso_percentual)}
                            </b> • Progresso: <b>{curso.progresso_percentual}%</b>
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                            {curso.aulas_concluidas} de {curso.total_aulas} aulas concluídas
                          </div>
                        </div>

                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/curso/${curso.id}`)}
                        >
                          Acessar curso
                        </button>
                      </div>

                      {/* Progresso */}
                      <div style={{ marginTop: 12 }}>
                        <div
                          style={{
                            height: 10,
                            borderRadius: 999,
                            background: "#e2e8f0",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${curso.progresso_percentual}%`,
                              height: "100%",
                              background: "linear-gradient(135deg, #00d4ff, #0099ff)",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MeusCursos;
