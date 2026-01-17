import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../App.css";

function Provas() {
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

  // Mock (depois vem do backend)
  const [provas] = useState([
    {
      id: 1,
      titulo: "Prova — Módulo: Fundamentos",
      curso: "Teologia Inteligente",
      status: "PENDENTE",
      tentativas: 0,
      maxTentativas: 2,
      nota: null,
      aprovado: null,
      prazo: "10/01/2026",
      tempoLimite: "20 min",
      descricao:
        "Avaliação dos conceitos do módulo Fundamentos. Faça com calma, sem consulta.",
    },
    {
      id: 2,
      titulo: "Prova — Boas-vindas",
      curso: "Teologia Inteligente",
      status: "CONCLUIDA",
      tentativas: 1,
      maxTentativas: 2,
      nota: 8.5,
      aprovado: true,
      prazo: null,
      tempoLimite: "10 min",
      descricao: "Avaliação introdutória para validar o entendimento inicial.",
    },
    {
      id: 3,
      titulo: "Prova — Liderança (Introdução)",
      curso: "Liderança Cristã na Prática",
      status: "NA_FILA",
      tentativas: 0,
      maxTentativas: 2,
      nota: null,
      aprovado: null,
      prazo: null,
      tempoLimite: "25 min",
      descricao: "Liberada após concluir o Módulo 1 (Introdução).",
    },
  ]);

  const resumo = useMemo(() => {
    const pendentes = provas.filter(p => p.status === "PENDENTE").length;
    const concluidas = provas.filter(p => p.status === "CONCLUIDA").length;
    const naFila = provas.filter(p => p.status === "NA_FILA").length;

    const media =
      provas.filter(p => typeof p.nota === "number").length === 0
        ? 0
        : Math.round(
            (provas
              .filter(p => typeof p.nota === "number")
              .reduce((acc, p) => acc + p.nota, 0) /
              provas.filter(p => typeof p.nota === "number").length) * 10
          ) / 10;

    return { pendentes, concluidas, naFila, media };
  }, [provas]);

  const [aba, setAba] = useState("PENDENTE"); // PENDENTE | CONCLUIDA | NA_FILA

  const lista = useMemo(() => {
    return provas.filter(p => p.status === aba);
  }, [provas, aba]);

  function voltarDashboard() {
    window.location.href = "/dashboard";
  }

  function iniciarProva(prova) {
    // MVP: depois vira tela de prova /provas/:id com questões reais
    if (prova.status !== "PENDENTE") {
      alert("Essa prova ainda não está disponível para realização.");
      return;
    }
    alert(`Em breve: iniciar prova "${prova.titulo}"`);
  }

  function verResultado(prova) {
    if (prova.status !== "CONCLUIDA") {
      alert("O resultado só aparece após concluir a prova.");
      return;
    }
    alert(
      `Resultado:\n\n${prova.titulo}\nCurso: ${prova.curso}\nNota: ${prova.nota}\nAprovado: ${
        prova.aprovado ? "SIM" : "NÃO"
      }`
    );
  }

  function Chip({ active, label, onClick }) {
    return (
      <button
        className="btn"
        onClick={onClick}
        style={{
          background: active ? "linear-gradient(135deg, #f5c84c, #f59e0b)" : "#ffffff",
          color: active ? "#10131a" : "#0f172a",
          border: active ? "0" : "1px solid rgba(15,23,42,0.12)",
          borderRadius: 999,
          padding: "10px 14px",
          fontWeight: 800
        }}
      >
        {label}
      </button>
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
            <a href="/provas" style={{ background: "rgba(255,255,255,0.10)" }}>
              Provas
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
            <h1>Provas</h1>
            <p>
              Veja as provas disponíveis, faça avaliações e acompanhe suas notas e resultados.
            </p>
          </div>

          {/* Resumo */}
          <div className="grid" style={{ marginTop: 14 }}>
            <div className="card span-3">
              <h3>Pendentes</h3>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {resumo.pendentes}
              </div>
              <p style={{ marginTop: 6 }}>Prontas para fazer.</p>
            </div>

            <div className="card span-3">
              <h3>Concluídas</h3>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {resumo.concluidas}
              </div>
              <p style={{ marginTop: 6 }}>Já realizadas.</p>
            </div>

            <div className="card span-3">
              <h3>Na fila</h3>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {resumo.naFila}
              </div>
              <p style={{ marginTop: 6 }}>Libera ao avançar.</p>
            </div>

            <div className="card span-3">
              <h3>Média</h3>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {resumo.media}
              </div>
              <p style={{ marginTop: 6 }}>Média das notas.</p>
            </div>

            {/* Filtro */}
            <div className="card span-12">
              <h3>Filtrar</h3>
              <p>Selecione a categoria de provas.</p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                <Chip
                  active={aba === "PENDENTE"}
                  label={`Pendentes (${resumo.pendentes})`}
                  onClick={() => setAba("PENDENTE")}
                />
                <Chip
                  active={aba === "CONCLUIDA"}
                  label={`Concluídas (${resumo.concluidas})`}
                  onClick={() => setAba("CONCLUIDA")}
                />
                <Chip
                  active={aba === "NA_FILA"}
                  label={`Na fila (${resumo.naFila})`}
                  onClick={() => setAba("NA_FILA")}
                />
              </div>
            </div>

            {/* Lista */}
            <div className="card span-12">
              <h3>Lista de Provas</h3>
              <p>Detalhes e ações.</p>

              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                {lista.length === 0 ? (
                  <div style={{ color: "#64748b" }}>Nenhuma prova nesta categoria.</div>
                ) : (
                  lista.map(p => (
                    <div
                      key={p.id}
                      style={{
                        border: "1px solid rgba(15,23,42,0.12)",
                        borderRadius: 16,
                        padding: 16,
                        background: "#fff"
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap"
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 900, fontSize: 16, color: "#0f172a" }}>
                            {p.titulo}
                          </div>
                          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                            Curso: <b>{p.curso}</b> • Tempo limite: <b>{p.tempoLimite}</b>
                            {p.prazo ? (
                              <>
                                {" "}• Prazo: <b>{p.prazo}</b>
                              </>
                            ) : null}
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {p.status === "PENDENTE" && (
                            <button className="btn btn-primary" onClick={() => iniciarProva(p)}>
                              Iniciar
                            </button>
                          )}

                          {p.status === "CONCLUIDA" && (
                            <button className="btn btn-primary" onClick={() => verResultado(p)}>
                              Ver resultado
                            </button>
                          )}

                          {p.status === "NA_FILA" && (
                            <button
                              className="btn"
                              style={{
                                background: "#ffffff",
                                border: "1px solid rgba(15,23,42,0.12)",
                                color: "#0f172a"
                              }}
                              onClick={() => alert("Essa prova será liberada ao concluir o módulo anterior.")}
                            >
                              Entendi
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ marginTop: 10, fontSize: 14, color: "#334155" }}>
                        {p.descricao}
                      </div>

                      <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
                        Tentativas: <b>{p.tentativas}</b> / <b>{p.maxTentativas}</b>
                        {p.status === "CONCLUIDA" && typeof p.nota === "number" ? (
                          <>
                            {" "}• Nota: <b>{p.nota}</b> • Aprovado:{" "}
                            <b style={{ color: p.aprovado ? "#16a34a" : "#b91c1c" }}>
                              {p.aprovado ? "SIM" : "NÃO"}
                            </b>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Próximo passo (MVP) */}
            <div className="card span-12">
              <h3>Próximo passo</h3>
              <p>
                Em seguida, vamos criar a tela de realização da prova (questões + timer + envio).
              </p>
              <button
                className="btn btn-primary"
                onClick={() => alert("Em breve: /provas/:id para realização da prova")}
              >
                Criar tela da prova
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Provas;
