import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import "../App.css";

function Dashboard() {
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCursos();
  }, []);

  async function loadCursos() {
    try {
      const response = await api.get("/api/aluno/minhas-matriculas");
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  // Mostra loading enquanto valida o token
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
        {isLoading ? "Verificando autenticação..." : "Carregando dados..."}
      </div>
    );
  }

  const alunoNome = user?.nome || "Aluno(a)";
  
  // Calcular curso mais avançado (em andamento)
  const cursosEmAndamento = cursos.filter(c => {
    const prog = parseFloat(c.progresso_percentual) || 0;
    return prog > 0 && prog < 100;
  });
  
  const cursoAtual = cursosEmAndamento.length > 0 
    ? cursosEmAndamento[0] 
    : cursos[0];
  
  const progresso = cursoAtual 
    ? Math.round(parseFloat(cursoAtual.progresso_percentual) || 0)
    : 0;

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
            <a href="/meus-cursos">Cursos</a>
            <a href="/provas">Provas</a>
            <a href="/avisos">Avisos</a>

            {/* ✅ Perfil */}
            <a href="/perfil">Perfil</a>

            <button className="btn btn-ghost" onClick={logout}>
              Sair
            </button>

            <button
              className="btn btn-primary"
              onClick={() => navigate("/catalogo")}
            >
              Catálogo de Cursos
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="main-inner">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="side-title">Meu Portal</div>

            <a className="side-item" href="/jornada">
              <span className="dot" /> Jornada
            </a>

            <a className="side-item" href="/meus-cursos">
              <span className="dot" /> Meus cursos
            </a>

            <a className="side-item" href="/catalogo">
              <span className="dot" /> Catálogo
            </a>

            <a className="side-item" href="/provas">
              <span className="dot" /> Provas
            </a>

            <a className="side-item" href="#boletos">
              <span className="dot" /> Boletos
            </a>

            <a className="side-item" href="/avisos">
              <span className="dot" /> Avisos
            </a>

            <div className="side-title" style={{ marginTop: 14 }}>
              Conta
            </div>

            {/* ✅ Perfil agora vai para /perfil */}
            <a className="side-item" href="/perfil">
              <span className="dot" /> Perfil
            </a>

            <button
              className="btn btn-primary"
              style={{ width: "100%", marginTop: 10 }}
              onClick={logout}
            >
              Sair
            </button>
          </aside>

          {/* Conteúdo */}
          <section className="content">
            <div className="hero">
              <h1>Bem-vindo(a), {alunoNome} 👋</h1>
              <p>
                Aqui você acompanha sua jornada, acessa aulas, faz provas e mantém
                sua matrícula em dia.
              </p>

              {cursoAtual ? (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Curso em andamento: <b>{cursoAtual.titulo}</b> • Progresso:{" "}
                  <b>{progresso}%</b>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 12,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  Você ainda não está matriculado em nenhum curso. <b><a href="/catalogo" style={{ color: "#f5c84c" }}>Explore o catálogo!</a></b>
                </div>
              )}
            </div>

            <div className="grid">
              <div className="card span-4" id="cursos">
                <h3>Meus Cursos</h3>
                <p>Acesse suas aulas e módulos.</p>
                <div style={{ marginTop: 12, fontSize: 14, color: "#334155" }}>
                  {cursos.length > 0 ? (
                    <>
                      <b>{cursos.length}</b> curso{cursos.length > 1 ? 's' : ''} matriculado{cursos.length > 1 ? 's' : ''}
                    </>
                  ) : (
                    "Nenhum curso ainda"
                  )}
                </div>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/meus-cursos")}
                  >
                    Abrir cursos
                  </button>
                </div>
              </div>

              <div className="card span-4" id="provas">
                <h3>Provas</h3>
                <p>Realize avaliações e acompanhe notas.</p>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/provas")}
                  >
                    Ver provas
                  </button>
                </div>
              </div>

              <div className="card span-4" id="boletos">
                <h3>Boletos</h3>
                <p>Consulta e pagamento (fase 2 do MVP).</p>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => alert("Financeiro entra após banco + cursos")}
                  >
                    Ver boletos
                  </button>
                </div>
              </div>

              <div className="card span-8" id="jornada">
                <h3>Jornada do Curso</h3>
                <p>Veja sua trilha, módulos e evolução.</p>

                {cursoAtual ? (
                  <div
                    style={{
                      marginTop: 12,
                      background: "#f2f4f8",
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: "#334155",
                        marginBottom: 6,
                      }}
                    >
                      Progresso: <b>{cursoAtual.titulo}</b>
                    </div>

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
                          width: `${progresso}%`,
                          height: "100%",
                          background:
                            "linear-gradient(135deg, #f5c84c, #f59e0b)",
                        }}
                      />
                    </div>

                    <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
                      {cursoAtual.aulas_concluidas || 0} de {cursoAtual.total_aulas || 0} aulas concluídas • {progresso}%
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate("/jornada")}
                      >
                        Abrir Jornada completa
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 12,
                      background: "#f2f4f8",
                      borderRadius: 14,
                      padding: 12,
                      textAlign: "center",
                      color: "#64748b"
                    }}
                  >
                    <div style={{ marginBottom: 12 }}>
                      Matricule-se em um curso para começar!
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/catalogo")}
                    >
                      Explorar catálogo
                    </button>
                  </div>
                )}
              </div>

              <div className="card span-4" id="avisos">
                <h3>Avisos</h3>
                <p>Comunicados do Instituto e lembretes.</p>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/avisos")}
                  >
                    Ver avisos
                  </button>
                </div>
              </div>

              {/* ✅ Card novo Perfil */}
              <div className="card span-4">
                <h3>Perfil</h3>
                <p>Atualize seus dados e preferências.</p>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/perfil")}
                  >
                    Abrir perfil
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
