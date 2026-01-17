import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../App.css";

function Perfil() {
  const { isLoading } = useAuth();

  // MVP: dados mock (depois vem do backend)
  const [dados, setDados] = useState({
    nome: "Aluno(a)",
    email: "aluno@alphamind.com.br",
    telefone: "",
    cpf: "",
    nascimento: "",
    endereco: "",
    cidade: "",
    estado: "",
    igreja: "",
    ministerio: "",
    observacoes: "",
  });

  const [editando, setEditando] = useState(false);
  const [msg, setMsg] = useState("");

  const resumo = useMemo(() => {
    const preenchidos = Object.entries(dados).filter(([_, v]) => String(v || "").trim()).length;
    const total = Object.keys(dados).length;
    const pct = Math.round((preenchidos / total) * 100);
    return { preenchidos, total, pct };
  }, [dados]);

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

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  function onChangeCampo(campo, valor) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  }

  function salvar(e) {
    e.preventDefault();
    setMsg("");

    // MVP: só simula salvar. Depois a gente manda pro backend.
    setEditando(false);
    setMsg("✅ Perfil atualizado (mock). Em breve: salvar no backend.");
    setTimeout(() => setMsg(""), 4000);
  }

  function cancelar() {
    // MVP: sem snapshot/rollback. Depois fazemos buscar do backend.
    setEditando(false);
    setMsg("⚠️ Edição cancelada (mock).");
    setTimeout(() => setMsg(""), 2500);
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
            <a href="/avisos">Avisos</a>

            <a href="/perfil" style={{ background: "rgba(255,255,255,0.10)" }}>
              Perfil
            </a>

            <button className="btn btn-ghost" onClick={voltarDashboard}>
              Voltar
            </button>
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
            <h1>Meu Perfil</h1>
            <p>
              Atualize seus dados para manter matrícula, provas e comunicações em dia.
            </p>
          </div>

          <div className="grid" style={{ marginTop: 14 }}>
            {/* Resumo do perfil */}
            <div className="card span-4">
              <h3>Completude</h3>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {resumo.pct}%
              </div>
              <p style={{ marginTop: 6 }}>
                Campos preenchidos: <b>{resumo.preenchidos}</b> de <b>{resumo.total}</b>
              </p>

              <div style={{ marginTop: 12, background: "#f2f4f8", borderRadius: 14, padding: 12 }}>
                <div style={{ fontSize: 13, color: "#334155", marginBottom: 6 }}>
                  Barra de completude
                </div>
                <div style={{ height: 10, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${resumo.pct}%`,
                      height: "100%",
                      background: "linear-gradient(135deg, #f5c84c, #f59e0b)",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                {!editando ? (
                  <button className="btn btn-primary" onClick={() => setEditando(true)}>
                    Editar perfil
                  </button>
                ) : (
                  <button className="btn btn-ghost" onClick={cancelar}>
                    Cancelar edição
                  </button>
                )}
              </div>

              {msg && (
                <div style={{ marginTop: 10, fontSize: 14, color: "#0f172a" }}>
                  {msg}
                </div>
              )}
            </div>

            {/* Dados pessoais */}
            <div className="card span-8">
              <h3>Dados pessoais</h3>
              <p>Esses dados serão usados no seu histórico acadêmico.</p>

              <form onSubmit={salvar} style={{ marginTop: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
                  <div style={{ gridColumn: "span 6" }}>
                    <label style={{ fontSize: 13, color: "#64748b" }}>Nome</label>
                    <input
                      value={dados.nome}
                      onChange={(e) => onChangeCampo("nome", e.target.value)}
                      disabled={!editando}
                      style={inputStyle(!editando)}
                    />
                  </div>

                  <div style={{ gridColumn: "span 6" }}>
                    <label style={{ fontSize: 13, color: "#64748b" }}>Email</label>
                    <input
                      value={dados.email}
                      onChange={(e) => onChangeCampo("email", e.target.value)}
                      disabled={!editando}
                      style={inputStyle(!editando)}
                    />
                  </div>

                  <div style={{ gridColumn: "span 4" }}>
                    <label style={{ fontSize: 13, color: "#64748b" }}>Telefone</label>
                    <input
                      value={dados.telefone}
                      onChange={(e) => onChangeCampo("telefone", e.target.value)}
                      disabled={!editando}
                      placeholder="(11) 9xxxx-xxxx"
                      style={inputStyle(!editando)}
                    />
                  </div>

                  <div style={{ gridColumn: "span 4" }}>
                    <label style={{ fontSize: 13, color: "#64748b" }}>CPF</label>
                    <input
                      value={dados.cpf}
                      onChange={(e) => onChangeCampo("cpf", e.target.value)}
                      disabled={!editando}
                      placeholder="xxx.xxx.xxx-xx"
                      style={inputStyle(!editando)}
                    />
                  </div>

                  <div style={{ gridColumn: "span 4" }}>
                    <label style={{ fontSize: 13, color: "#64748b" }}>Nascimento</label>
                    <input
                      value={dados.nascimento}
                      onChange={(e) => onChangeCampo("nascimento", e.target.value)}
                      disabled={!editando}
                      placeholder="dd/mm/aaaa"
                      style={inputStyle(!editando)}
                    />
                  </div>

                  <div style={{ gridColumn: "span 12" }}>
                    <label style={{ fontSize: 13, color: "#64748b" }}>Endereço</label>
                    <input
                      value={dados.endereco}
                      onChange={(e) => onChangeCampo("endereco", e.target.value)}
                      disabled={!editando}
                      placeholder="Rua, número, bairro..."
                      style={inputStyle(!editando)}
                    />
                  </div>

                  <div style={{ gridColumn: "span 6" }}>
                    <label style={{ fontSize: 13, color: "#64748b" }}>Cidade</label>
                    <input
                      value={dados.cidade}
                      onChange={(e) => onChangeCampo("cidade", e.target.value)}
                      disabled={!editando}
                      style={inputStyle(!editando)}
                    />
                  </div>

                  <div style={{ gridColumn: "span 6" }}>
                    <label style={{ fontSize: 13, color: "#64748b" }}>Estado</label>
                    <input
                      value={dados.estado}
                      onChange={(e) => onChangeCampo("estado", e.target.value)}
                      disabled={!editando}
                      placeholder="SP, RJ..."
                      style={inputStyle(!editando)}
                    />
                  </div>
                </div>

                {editando && (
                  <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button className="btn btn-primary" type="submit">
                      Salvar alterações
                    </button>
                    <button className="btn btn-ghost" type="button" onClick={cancelar}>
                      Cancelar
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Informações do instituto */}
            <div className="card span-12">
              <h3>Informações adicionais</h3>
              <p>Ajuda o Instituto a te atender melhor.</p>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
                <div style={{ gridColumn: "span 6" }}>
                  <label style={{ fontSize: 13, color: "#64748b" }}>Igreja</label>
                  <input
                    value={dados.igreja}
                    onChange={(e) => onChangeCampo("igreja", e.target.value)}
                    disabled={!editando}
                    style={inputStyle(!editando)}
                  />
                </div>

                <div style={{ gridColumn: "span 6" }}>
                  <label style={{ fontSize: 13, color: "#64748b" }}>Ministério</label>
                  <input
                    value={dados.ministerio}
                    onChange={(e) => onChangeCampo("ministerio", e.target.value)}
                    disabled={!editando}
                    style={inputStyle(!editando)}
                  />
                </div>

                <div style={{ gridColumn: "span 12" }}>
                  <label style={{ fontSize: 13, color: "#64748b" }}>Observações</label>
                  <textarea
                    value={dados.observacoes}
                    onChange={(e) => onChangeCampo("observacoes", e.target.value)}
                    disabled={!editando}
                    rows={4}
                    style={{
                      ...inputStyle(!editando),
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              {!editando && (
                <div style={{ marginTop: 14 }}>
                  <button className="btn btn-primary" onClick={() => setEditando(true)}>
                    Editar informações
                  </button>
                </div>
              )}
            </div>

            {/* Segurança da conta (MVP) */}
            <div className="card span-12">
              <h3>Segurança da conta</h3>
              <p>Boas práticas e ações rápidas (fase 2).</p>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => alert("Em breve: trocar senha")}>
                  Trocar senha
                </button>
                <button className="btn btn-ghost" onClick={() => alert("Em breve: 2FA / verificação")}>
                  Ativar verificação
                </button>
                <button className="btn btn-ghost" onClick={() => alert("Em breve: sessões e dispositivos")}>
                  Ver sessões ativas
                </button>
              </div>

              <div style={{ marginTop: 10, fontSize: 14, color: "#334155" }}>
                • Dica: use uma senha forte e não reutilize em outros sites.<br />
                • Em breve: integração real com backend + segurança.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function inputStyle(disabled) {
  return {
    width: "100%",
    marginTop: 6,
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.12)",
    outline: "none",
    background: disabled ? "rgba(15,23,42,0.04)" : "#ffffff",
    color: "#0f172a",
  };
}

export default Perfil;
