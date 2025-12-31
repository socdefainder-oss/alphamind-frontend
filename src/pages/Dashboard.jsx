import { useEffect } from "react";
import "../App.css";

function Dashboard() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/";
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  // placeholders do MVP (depois a gente puxa do backend)
  const alunoNome = "Aluno(a)";
  const cursoAtual = "Teologia Inteligente";
  const progresso = 20;

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
            <a href="/provas">Provas</a>
            <a href="/avisos">Avisos</a>

            {/* ✅ Perfil */}
            <a href="/perfil">Perfil</a>

            <button className="btn btn-ghost" onClick={logout}>
              Sair
            </button>

            <button
              className="btn btn-primary"
              onClick={() => alert("Em breve: matrícula/rematrícula")}
            >
              Matrícula / Rematrícula
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

              <div
                style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Curso em andamento: <b>{cursoAtual}</b> • Progresso:{" "}
                <b>{progresso}%</b>
              </div>
            </div>

            <div className="grid">
              <div className="card span-4" id="cursos">
                <h3>Meus Cursos</h3>
                <p>Acesse suas aulas e módulos.</p>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => (window.location.href = "/meus-cursos")}
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
                    onClick={() => (window.location.href = "/provas")}
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
                    Progresso do curso
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

                  <div style={{ marginTop: 12 }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => (window.location.href = "/jornada")}
                    >
                      Abrir Jornada completa
                    </button>
                  </div>
                </div>
              </div>

              <div className="card span-4" id="avisos">
                <h3>Avisos</h3>
                <p>Comunicados do Instituto e lembretes.</p>
                <div style={{ marginTop: 12 }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => (window.location.href = "/avisos")}
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
                    onClick={() => (window.location.href = "/perfil")}
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
