import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../App.css";

function MeusCursos() {
  const { isLoading } = useAuth();

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

  // Mock inicial (depois vem do backend)
  const [cursos] = useState([
    {
      id: 1,
      titulo: "Teologia Inteligente",
      status: "EM_ANDAMENTO",
      progresso: 20,
      modulos: [
        { id: 11, titulo: "Boas-vindas", progresso: 100 },
        { id: 12, titulo: "Fundamentos", progresso: 40 },
        { id: 13, titulo: "Aplicação prática", progresso: 0 },
      ],
    },
    {
      id: 2,
      titulo: "Liderança Cristã na Prática",
      status: "NA_FILA",
      progresso: 0,
      modulos: [
        { id: 21, titulo: "Introdução", progresso: 0 },
        { id: 22, titulo: "Serviço e caráter", progresso: 0 },
      ],
    },
    {
      id: 3,
      titulo: "Fundamentos da Fé",
      status: "CONCLUIDO",
      progresso: 100,
      modulos: [
        { id: 31, titulo: "Bases da fé", progresso: 100 },
        { id: 32, titulo: "Vida cristã", progresso: 100 },
      ],
    },
  ]);

  const resumo = useMemo(() => {
    return {
      emAndamento: cursos.filter(c => c.status === "EM_ANDAMENTO").length,
      naFila: cursos.filter(c => c.status === "NA_FILA").length,
      concluidos: cursos.filter(c => c.status === "CONCLUIDO").length,
    };
  }, [cursos]);

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
                Portal do Aluno
              </div>
            </div>
          </div>

          <nav className="nav">
            <a href="/dashboard">Home</a>
            <a href="/jornada">Jornada</a>
            <a href="/meus-cursos" style={{ background: "rgba(255,255,255,0.10)" }}>
              Meus Cursos
            </a>
            <button className="btn btn-ghost" onClick={() => window.location.href = "/dashboard"}>
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
                {cursos.map(curso => (
                  <div
                    key={curso.id}
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
                          Status: <b>{curso.status.replace("_", " ")}</b> • Progresso:{" "}
                          <b>{curso.progresso}%</b>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={() => alert(`Em breve: abrir curso "${curso.titulo}"`)}
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
                            width: `${curso.progresso}%`,
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #f5c84c, #f59e0b)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Módulos */}
                    <div
                      style={{
                        marginTop: 12,
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: 10,
                      }}
                    >
                      {curso.modulos.map(m => (
                        <div
                          key={m.id}
                          style={{
                            gridColumn: "span 4",
                            background: "#f2f4f8",
                            borderRadius: 14,
                            padding: 12,
                            border: "1px solid rgba(15,23,42,0.10)",
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{m.titulo}</div>
                          <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
                            Progresso: <b>{m.progresso}%</b>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MeusCursos;
