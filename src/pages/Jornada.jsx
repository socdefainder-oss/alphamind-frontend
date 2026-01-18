import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import "../App.css";

function Jornada() {
  const { isLoading } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [cursosDetalhados, setCursosDetalhados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJornadaData();
  }, []);

  async function loadJornadaData() {
    try {
      // Buscar cursos matriculados
      const response = await api.get("/api/aluno/minhas-matriculas");
      setCursos(response.data);

      // Para cada curso, buscar detalhes com módulos
      const detalhesPromises = response.data.map(async (curso) => {
        try {
          const progressoRes = await api.get(`/api/aluno/progresso/${curso.curso_id}`);
          return {
            ...curso,
            modulosDetalhados: progressoRes.data.modulos || []
          };
        } catch (error) {
          console.error(`Erro ao buscar progresso do curso ${curso.curso_id}:`, error);
          return { ...curso, modulosDetalhados: [] };
        }
      });

      const detalhados = await Promise.all(detalhesPromises);
      setCursosDetalhados(detalhados);
    } catch (error) {
      console.error("Erro ao carregar jornada:", error);
    } finally {
      setLoading(false);
    }
  }

  const resumo = useMemo(() => {
    const emAndamento = cursos.filter(c => {
      const prog = parseFloat(c.progresso_percentual) || 0;
      return prog > 0 && prog < 100;
    }).length;

    const concluidos = cursos.filter(c => parseFloat(c.progresso_percentual) === 100).length;
    const naFila = cursos.filter(c => parseFloat(c.progresso_percentual) === 0).length;

    const mediaProgresso =
      cursos.length === 0
        ? 0
        : Math.round(
            cursos.reduce((acc, c) => acc + (parseFloat(c.progresso_percentual) || 0), 0) / cursos.length
          );

    // Provas pendentes - ainda não implementadas, então sempre 0
    const provasPendentes = 0;

    // Próximas aulas: buscar em todos os cursos as aulas não concluídas
    const proximasAulas = [];
    // TODO: implementar quando tivermos endpoint de próximas aulas

    return { emAndamento, concluidos, naFila, mediaProgresso, provasPendentes, proximasAulas };
  }, [cursos]);

  if (isLoading || loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: 18,
        color: "#64748b"
      }}>
        {isLoading ? "Verificando autenticação..." : "Carregando jornada..."}
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
    const prog = parseFloat(progresso) || 0;
    if (prog === 0) return "NA FILA";
    if (prog === 100) return "CONCLUÍDO";
    return "EM ANDAMENTO";
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
            <a href="/jornada" style={{ background: "rgba(255,255,255,0.10)" }}>Jornada</a>
            <a href="/meus-cursos">Cursos</a>
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
            <h1>Jornada do Aluno</h1>
            <p>
              Aqui você acompanha seu desenvolvimento, metas, provas e os próximos passos do seu aprendizado.
            </p>

            <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
                <b>Aluno(a)</b> • Nível: <b>Iniciante</b> • Desde: <b>Jan/2026</b>
              </div>
            </div>
          </div>

          {/* Cards resumo */}
          <div className="grid" style={{ marginTop: 14 }}>
            <div className="card span-4">
              <h3>Progresso médio</h3>
              <p>Sua média geral nos cursos.</p>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>
                  {resumo.mediaProgresso}%
                </div>

                <div style={{ height: 10, borderRadius: 999, background: "#e2e8f0", overflow: "hidden", marginTop: 8 }}>
                  <div style={{ width: `${resumo.mediaProgresso}%`, height: "100%", background: "linear-gradient(135deg, #f5c84c, #f59e0b)" }} />
                </div>
              </div>
            </div>

            <div className="card span-4">
              <h3>Cursos</h3>
              <p>Status do seu aprendizado.</p>
              <div style={{ marginTop: 12, color: "#0f172a", fontSize: 14, lineHeight: 1.8 }}>
                • Em andamento: <b>{resumo.emAndamento}</b><br />
                • Na fila: <b>{resumo.naFila}</b><br />
                • Concluídos: <b>{resumo.concluidos}</b>
              </div>
            </div>

            <div className="card span-4">
              <h3>Provas pendentes</h3>
              <p>O que falta para avançar.</p>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a" }}>
                  {resumo.provasPendentes}
                </div>
                <div style={{ marginTop: 10 }}>
                  <button className="btn btn-primary" onClick={() => alert("Em breve: abrir lista de provas")}>
                    Ver provas
                  </button>
                </div>
              </div>
            </div>

            {/* Próximas aulas */}
            <div className="card span-8">
              <h3>Próximas aulas</h3>
              <p>Continue de onde parou.</p>

              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {resumo.proximasAulas.length === 0 ? (
                  <div style={{ color: "#64748b" }}>
                    {cursos.length === 0 
                      ? "Matricule-se em um curso para começar sua jornada!"
                      : "Continue seus estudos acessando seus cursos."}
                  </div>
                ) : (
                  resumo.proximasAulas.map(a => (
                    <div
                      key={a.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: 12,
                        borderRadius: 14,
                        background: "#f2f4f8",
                        border: "1px solid rgba(15,23,42,0.10)"
                      }}
                    >
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{a.titulo}</div>
                      <div style={{ color: "#64748b" }}>{a.duracao}</div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ marginTop: 12 }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate("/meus-cursos")}
                >
                  Ver meus cursos
                </button>
              </div>
            </div>

            {/* Cursos em detalhe */}
            <div className="card span-4">
              <h3>Próximos cursos</h3>
              <p>Sugestões para a sua trilha.</p>

              <div style={{ marginTop: 12, fontSize: 14, color: "#334155", lineHeight: 1.8 }}>
                Navegue pelo catálogo e descubra novos cursos para sua formação teológica.
              </div>

              <div style={{ marginTop: 12 }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate("/catalogo")}
                >
                  Ver catálogo
                </button>
              </div>
            </div>

            {/* Lista de cursos (com módulos) */}
            <div className="card span-12">
              <h3>Meus cursos — visão detalhada</h3>
              <p>Você enxerga sua trilha, módulos e o que falta.</p>

              {cursosDetalhados.length === 0 ? (
                <div style={{ marginTop: 14, color: "#64748b", textAlign: "center", padding: "40px 20px" }}>
                  <div style={{ fontSize: 16, marginBottom: 12 }}>
                    Você ainda não está matriculado em nenhum curso.
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/catalogo")}
                  >
                    Explorar catálogo
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                  {cursosDetalhados.map(curso => {
                    const progresso = parseFloat(curso.progresso_percentual) || 0;
                    const status = getStatusLabel(curso.progresso_percentual);

                    return (
                      <div
                        key={curso.curso_id}
                        style={{
                          padding: 14,
                          borderRadius: 16,
                          border: "1px solid rgba(15,23,42,0.12)",
                          background: "#fff"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                          <div>
                            <div style={{ fontWeight: 900, fontSize: 16, color: "#0f172a" }}>
                              {curso.titulo}
                            </div>
                            <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                              Status: <b>{status}</b> • Progresso: <b>{progresso.toFixed(0)}%</b>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/curso/${curso.curso_id}`)}
                          >
                            Abrir curso
                          </button>
                        </div>

                        {/* Barra progresso */}
                        <div style={{ marginTop: 12 }}>
                          <div style={{ height: 10, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                            <div style={{ width: `${progresso}%`, height: "100%", background: "linear-gradient(135deg, #f5c84c, #f59e0b)" }} />
                          </div>
                        </div>

                        {/* Módulos */}
                        {curso.modulosDetalhados && curso.modulosDetalhados.length > 0 && (
                          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10 }}>
                            {curso.modulosDetalhados.map(m => {
                              const moduloProg = parseFloat(m.progresso_percentual) || 0;
                              return (
                                <div
                                  key={m.modulo_id}
                                  style={{
                                    gridColumn: "span 4",
                                    background: "#f2f4f8",
                                    border: "1px solid rgba(15,23,42,0.10)",
                                    borderRadius: 14,
                                    padding: 12
                                  }}
                                >
                                  <div style={{ fontWeight: 800, color: "#0f172a" }}>{m.modulo_titulo}</div>
                                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
                                    Progresso: <b>{moduloProg.toFixed(0)}%</b>
                                  </div>
                                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                                    {m.aulas_concluidas} de {m.total_aulas} aulas
                                  </div>
                                  <div style={{ height: 8, borderRadius: 999, background: "#e2e8f0", overflow: "hidden", marginTop: 8 }}>
                                    <div style={{ width: `${moduloProg}%`, height: "100%", background: "linear-gradient(135deg, #f5c84c, #f59e0b)" }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Provas do curso */}
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontSize: 13, color: "#64748b" }}>Provas</div>
                          <div style={{ marginTop: 6, color: "#334155" }}>
                            Sistema de provas será implementado em breve.
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default Jornada;
