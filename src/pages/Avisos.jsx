import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../App.css";

function Avisos() {
  const { isLoading } = useAuth();

  // Mock (depois vem do backend)
  const [avisos] = useState([
    {
      id: 1,
      titulo: "Bem-vindo ao Portal do Aluno",
      tipo: "GERAL", // GERAL | ACADEMICO | FINANCEIRO | SUPORTE
      prioridade: "NORMAL", // NORMAL | IMPORTANTE
      data: "30/12/2025",
      texto:
        "Agora você consegue acompanhar sua jornada, cursos e provas em um único lugar. Aos poucos vamos ativar novas funcionalidades.",
      lido: false,
    },
    {
      id: 2,
      titulo: "Prova liberada — Módulo Fundamentos",
      tipo: "ACADEMICO",
      prioridade: "IMPORTANTE",
      data: "30/12/2025",
      texto:
        "A prova do módulo Fundamentos já está disponível na aba Provas. Faça com calma e revise as aulas antes de iniciar.",
      lido: false,
    },
    {
      id: 3,
      titulo: "Calendário do Instituto (Janeiro)",
      tipo: "GERAL",
      prioridade: "NORMAL",
      data: "29/12/2025",
      texto:
        "O calendário de Janeiro será publicado em breve. Fique atento(a) aos avisos para eventos e datas de aulas ao vivo.",
      lido: true,
    },
    {
      id: 4,
      titulo: "Atenção: Matrícula / Rematrícula (em breve)",
      tipo: "ACADEMICO",
      prioridade: "IMPORTANTE",
      data: "28/12/2025",
      texto:
        "Em breve você conseguirá fazer matrícula e rematrícula direto pelo portal. Assim que liberar, avisaremos aqui.",
      lido: true,
    },
    {
      id: 5,
      titulo: "Pagamentos e boletos (fase 2 do MVP)",
      tipo: "FINANCEIRO",
      prioridade: "NORMAL",
      data: "27/12/2025",
      texto:
        "A área de boletos e pagamentos será ativada após conectarmos o banco de dados e o fluxo financeiro.",
      lido: false,
    },
  ]);

  const [tipoFiltro, setTipoFiltro] = useState("TODOS"); // TODOS | GERAL | ACADEMICO | FINANCEIRO | SUPORTE
  const [statusFiltro, setStatusFiltro] = useState("TODOS"); // TODOS | LIDOS | NAO_LIDOS
  const [busca, setBusca] = useState("");

  const resumo = useMemo(() => {
    const naoLidos = avisos.filter((a) => !a.lido).length;
    const importantes = avisos.filter((a) => a.prioridade === "IMPORTANTE").length;
    const total = avisos.length;
    return { naoLidos, importantes, total };
  }, [avisos]);

  const lista = useMemo(() => {
    let base = [...avisos];

    if (tipoFiltro !== "TODOS") {
      base = base.filter((a) => a.tipo === tipoFiltro);
    }

    if (statusFiltro === "LIDOS") {
      base = base.filter((a) => a.lido);
    } else if (statusFiltro === "NAO_LIDOS") {
      base = base.filter((a) => !a.lido);
    }

    if (busca.trim()) {
      const q = busca.toLowerCase();
      base = base.filter(
        (a) =>
          (a.titulo || "").toLowerCase().includes(q) ||
          (a.texto || "").toLowerCase().includes(q)
      );
    }

    // Importantes primeiro (mock)
    base.sort((a, b) => {
      const pa = a.prioridade === "IMPORTANTE" ? 1 : 0;
      const pb = b.prioridade === "IMPORTANTE" ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return 0;
    });

    return base;
  }, [avisos, tipoFiltro, statusFiltro, busca]);

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

  function voltarDashboard() {
    window.location.href = "/dashboard";
  }

  function Chip({ active, label, onClick }) {
    return (
      <button
        className="btn"
        onClick={onClick}
        style={{
          background: active
            ? "linear-gradient(135deg, #f5c84c, #f59e0b)"
            : "#ffffff",
          color: active ? "#10131a" : "#0f172a",
          border: active ? "0" : "1px solid rgba(15,23,42,0.12)",
          borderRadius: 999,
          padding: "10px 14px",
          fontWeight: 800,
        }}
      >
        {label}
      </button>
    );
  }

  function Badge({ text, important }) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 900,
          padding: "6px 10px",
          borderRadius: 999,
          background: important
            ? "rgba(245, 158, 11, 0.20)"
            : "rgba(15, 23, 42, 0.06)",
          border: "1px solid rgba(15,23,42,0.10)",
          color: "#0f172a",
        }}
      >
        {text}
      </span>
    );
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
            <a href="/jornada">Jornada</a>
            <a href="/meus-cursos">Meus Cursos</a>
            <a href="/provas">Provas</a>
            <a href="/avisos" style={{ background: "rgba(255,255,255,0.10)" }}>
              Avisos
            </a>
            <button className="btn btn-ghost" onClick={voltarDashboard}>
              Voltar
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="main-inner" style={{ gridTemplateColumns: "1fr" }}>
          {/* Hero */}
          <div className="hero">
            <h1>Avisos</h1>
            <p>
              Comunicados do Instituto, atualizações acadêmicas e lembretes importantes.
            </p>
          </div>

          <div className="grid" style={{ marginTop: 14 }}>
            <div className="card span-4">
              <h3>Não lidos</h3>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {resumo.naoLidos}
              </div>
              <p style={{ marginTop: 6 }}>Avisos que ainda precisam da sua atenção.</p>
            </div>

            <div className="card span-4">
              <h3>Importantes</h3>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {resumo.importantes}
              </div>
              <p style={{ marginTop: 6 }}>Prioridade alta (provas, prazos, ações).</p>
            </div>

            <div className="card span-4">
              <h3>Total</h3>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {resumo.total}
              </div>
              <p style={{ marginTop: 6 }}>Quantidade total de comunicados.</p>
            </div>

            <div className="card span-12">
              <h3>Filtros</h3>
              <p>Refine os avisos por tipo, status e busca.</p>

              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(12, 1fr)",
                  gap: 12,
                }}
              >
                <div style={{ gridColumn: "span 6" }}>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                    Tipo
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Chip
                      active={tipoFiltro === "TODOS"}
                      label="Todos"
                      onClick={() => setTipoFiltro("TODOS")}
                    />
                    <Chip
                      active={tipoFiltro === "GERAL"}
                      label="Geral"
                      onClick={() => setTipoFiltro("GERAL")}
                    />
                    <Chip
                      active={tipoFiltro === "ACADEMICO"}
                      label="Acadêmico"
                      onClick={() => setTipoFiltro("ACADEMICO")}
                    />
                    <Chip
                      active={tipoFiltro === "FINANCEIRO"}
                      label="Financeiro"
                      onClick={() => setTipoFiltro("FINANCEIRO")}
                    />
                    <Chip
                      active={tipoFiltro === "SUPORTE"}
                      label="Suporte"
                      onClick={() => setTipoFiltro("SUPORTE")}
                    />
                  </div>
                </div>

                <div style={{ gridColumn: "span 6" }}>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                    Status
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Chip
                      active={statusFiltro === "TODOS"}
                      label="Todos"
                      onClick={() => setStatusFiltro("TODOS")}
                    />
                    <Chip
                      active={statusFiltro === "NAO_LIDOS"}
                      label="Não lidos"
                      onClick={() => setStatusFiltro("NAO_LIDOS")}
                    />
                    <Chip
                      active={statusFiltro === "LIDOS"}
                      label="Lidos"
                      onClick={() => setStatusFiltro("LIDOS")}
                    />
                  </div>
                </div>

                <div style={{ gridColumn: "span 12" }}>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                    Busca
                  </div>
                  <input
                    placeholder="Buscar por título ou conteúdo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(15,23,42,0.12)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="card span-12">
              <h3>Lista de avisos</h3>
              <p>Importantes aparecem primeiro.</p>

              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {lista.length === 0 ? (
                  <div style={{ color: "#64748b" }}>Nenhum aviso encontrado.</div>
                ) : (
                  lista.map((a) => (
                    <div
                      key={a.id}
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
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ fontWeight: 900, fontSize: 16, color: "#0f172a" }}>
                              {a.titulo}
                            </div>
                            {!a.lido ? <Badge text="NOVO" /> : <Badge text="LIDO" />}
                            {a.prioridade === "IMPORTANTE" ? (
                              <Badge text="IMPORTANTE" important />
                            ) : null}
                            <Badge text={a.tipo} />
                          </div>

                          <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
                            Data: <b>{a.data}</b>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {a.tipo === "ACADEMICO" && (
                            <button
                              className="btn btn-primary"
                              onClick={() => (window.location.href = "/provas")}
                            >
                              Ir para Provas
                            </button>
                          )}

                          {a.tipo === "FINANCEIRO" && (
                            <button
                              className="btn btn-primary"
                              onClick={() => alert("Em breve: área de boletos")}
                            >
                              Ver financeiro
                            </button>
                          )}

                          <button
                            className="btn"
                            style={{
                              background: "#ffffff",
                              border: "1px solid rgba(15,23,42,0.12)",
                              color: "#0f172a",
                            }}
                            onClick={() => alert("Em breve: marcar como lido (backend)")}
                          >
                            Marcar como lido
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: 12, fontSize: 14, color: "#334155", lineHeight: 1.6 }}>
                        {a.texto}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card span-12">
              <h3>Próximo passo</h3>
              <p>
                Em seguida, vamos ligar isso no backend para salvar lido/não lido e cadastrar avisos reais.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => alert("Em breve: backend de avisos (CRUD + lido/não lido)")}
              >
                Conectar no backend
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Avisos;
