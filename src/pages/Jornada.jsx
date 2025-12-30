import { useEffect, useMemo, useState } from "react";
import "../App.css";

function Jornada() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/";
  }, []);

  // Mock (por enquanto). Depois vem do backend.
  const [aluno] = useState({
    nome: "Aluno(a)",
    nivel: "Iniciante",
    membroDesde: "Jan/2026",
  });

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
      proximasAulas: [
        { id: 101, titulo: "Aula 03 — Fundamentos (parte 2)", duracao: "12 min" },
        { id: 102, titulo: "Aula 04 — Exercício guiado", duracao: "18 min" },
      ],
      provas: [
        { id: 201, titulo: "Prova do Módulo: Fundamentos", status: "PENDENTE" },
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
      proximasAulas: [],
      provas: [],
    },
  ]);

  const resumo = useMemo(() => {
    const emAndamento = cursos.filter(c => c.status === "EM_ANDAMENTO").length;
    const concluidos = cursos.filter(c => c.status === "CONCLUIDO").length;
    const naFila = cursos.filter(c => c.status === "NA_FILA").length;

    const mediaProgresso =
      cursos.length === 0
        ? 0
        : Math.round(cursos.reduce((acc, c) => acc + (c.progresso || 0), 0) / cursos.length);

    const provasPendentes = cursos
      .flatMap(c => c.provas || [])
      .filter(p => p.status === "PENDENTE").length;

    const proximasAulas = cursos
      .flatMap(c => c.proximasAulas || [])
      .slice(0, 4);

    return { emAndamento, concluidos, naFila, mediaProgresso, provasPendentes, proximasAulas };
  }, [cursos]);

  function voltarDashboard() {
    window.location.href = "/dashboard";
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
                Portal do Aluno
              </div>
            </div>
          </div>

          <nav className="nav">
            <a href="/dashboard">Home</a>
            <a href="/jornada" style={{ background: "rgba(255,255,255,0.10)" }}>Jornada</a>
            <a href="/dashboard#cursos">Cursos</a>
            <a href="/dashboard#provas">Provas</a>
            <button className="btn btn-ghost" onClick={voltarDashboard}>Voltar</button>
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
                <b>{aluno.nome}</b> • Nível: <b>{aluno.nivel}</b> • Desde: <b>{aluno.membroDesde}</b>
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
                  <div style={{ color: "#64748b" }}>Sem aulas sugeridas no momento.</div>
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
                <button className="btn btn-primary" onClick={() => alert("Em breve: abrir player da próxima aula")}>
                  Continuar
                </button>
              </div>
            </div>

            {/* Cursos em detalhe */}
            <div className="card span-4">
              <h3>Próximos cursos</h3>
              <p>Sugestões para a sua trilha.</p>

              <div style={{ marginTop: 12, fontSize: 14, color: "#334155", lineHeight: 1.8 }}>
                • Fundamentos da Fé (em breve)<br />
                • Vida Devocional (em breve)<br />
                • Liderança e Serviço (em breve)
              </div>

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary" onClick={() => alert("Em breve: catálogo de cursos")}>
                  Ver catálogo
                </button>
              </div>
            </div>

            {/* Lista de cursos (com módulos) */}
            <div className="card span-12">
              <h3>Meus cursos — visão detalhada</h3>
              <p>Você enxerga sua trilha, módulos e o que falta.</p>

              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                {cursos.map(curso => (
                  <div
                    key={curso.id}
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
                          Status: <b>{curso.status.replaceAll("_", " ")}</b> • Progresso: <b>{curso.progresso}%</b>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={() => alert(`Em breve: abrir curso "${curso.titulo}"`)}
                      >
                        Abrir curso
                      </button>
                    </div>

                    {/* Barra progresso */}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ height: 10, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                        <div style={{ width: `${curso.progresso}%`, height: "100%", background: "linear-gradient(135deg, #f5c84c, #f59e0b)" }} />
                      </div>
                    </div>

                    {/* Módulos */}
                    <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10 }}>
                      {(curso.modulos || []).map(m => (
                        <div
                          key={m.id}
                          style={{
                            gridColumn: "span 4",
                            background: "#f2f4f8",
                            border: "1px solid rgba(15,23,42,0.10)",
                            borderRadius: 14,
                            padding: 12
                          }}
                        >
                          <div style={{ fontWeight: 800, color: "#0f172a" }}>{m.titulo}</div>
                          <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
                            Progresso: <b>{m.progresso}%</b>
                          </div>
                          <div style={{ height: 8, borderRadius: 999, background: "#e2e8f0", overflow: "hidden", marginTop: 8 }}>
                            <div style={{ width: `${m.progresso}%`, height: "100%", background: "linear-gradient(135deg, #f5c84c, #f59e0b)" }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Provas do curso */}
                    <div style={{ marginTop: 12 }}>
                      <div style={{ fontSize: 13, color: "#64748b" }}>Provas</div>
                      {(curso.provas || []).length === 0 ? (
                        <div style={{ marginTop: 6, color: "#334155" }}>Nenhuma prova cadastrada ainda.</div>
                      ) : (
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                          {curso.provas.map(p => (
                            <div
                              key={p.id}
                              style={{
                                padding: 10,
                                borderRadius: 12,
                                border: "1px solid rgba(15,23,42,0.10)",
                                background: "#fff",
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 10
                              }}
                            >
                              <div style={{ fontWeight: 700, color: "#0f172a" }}>{p.titulo}</div>
                              <div style={{ color: p.status === "PENDENTE" ? "#b45309" : "#16a34a", fontWeight: 800 }}>
                                {p.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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

export default Jornada;
