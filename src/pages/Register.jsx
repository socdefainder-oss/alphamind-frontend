import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se já tiver token, manda pro dashboard
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  async function handleRegister(e) {
    e.preventDefault();
    setErro("");
    setOk("");
    setLoading(true);

    try {
      await api.post("/register", { nome, email, senha });

      setOk("✅ Conta criada com sucesso! Agora você já pode entrar.");
      setNome("");
      setEmail("");
      setSenha("");

      // opcional: mandar direto pro login
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      setErro("Não foi possível criar a conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% 10%, rgba(245, 200, 76, 0.35), transparent 55%), radial-gradient(900px 500px at 80% 15%, rgba(245, 158, 11, 0.22), transparent 55%), linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
      }}
    >
      <div
        className="auth-container"
        style={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        {/* Branding (esquerda) */}
        <div
          className="auth-branding"
          style={{
            borderRadius: 22,
            padding: 28,
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(15,23,42,0.82))",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 18px 60px rgba(15, 23, 42, 0.15)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -1,
              background:
                "radial-gradient(600px 240px at 25% 20%, rgba(245, 200, 76, 0.55), transparent 60%), radial-gradient(520px 220px at 70% 35%, rgba(245, 158, 11, 0.35), transparent 60%)",
              opacity: 0.55,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "white",
                  boxShadow: "0 10px 25px rgba(245, 158, 11, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden"
                }}
              >
                <img src="/logo.png" alt="AlphaMind" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 18 }}>
                  Instituto AlphaMind
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                  Transformação através do conhecimento
                </div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 34,
                  lineHeight: 1.05,
                  letterSpacing: -0.6,
                }}
              >
                Criar conta
              </h1>

              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  fontSize: 14.5,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.6,
                  maxWidth: 440,
                }}
              >
                Crie seu acesso para acompanhar cursos, jornada e provas.
                Leva menos de 1 minuto.
              </p>
            </div>

            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0,1fr))",
                gap: 12,
              }}
            >
              {[
                { t: "Acesso imediato", s: "Entre e navegue no portal" },
                { t: "Jornada", s: "Seu progresso organizado" },
                { t: "Provas", s: "Avaliações e notas" },
                { t: "Avisos", s: "Comunicados do Instituto" },
              ].map((item) => (
                <div
                  key={item.t}
                  style={{
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: 12,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 13 }}>{item.t}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                    {item.s}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 16,
                fontSize: 12,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              © {new Date().getFullYear()} Instituto AlphaMind • Portal do Aluno
            </div>
          </div>
        </div>

        {/* Form (direita) */}
        <div
          className="auth-form"
          style={{
            borderRadius: 22,
            padding: 28,
            background: "#ffffff",
            boxShadow: "0 18px 60px rgba(15, 23, 42, 0.10)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a" }}>
              Cadastro
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
              Preencha seus dados para criar sua conta.
            </div>
          </div>

          <form onSubmit={handleRegister} style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, color: "#64748b" }}>Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: "#64748b" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: "#64748b" }}>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Crie uma senha"
                autoComplete="new-password"
                required
                style={inputStyle}
              />
              <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>
                Dica: use pelo menos 8 caracteres.
              </div>
            </div>

            {erro && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.10)",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  color: "#991b1b",
                  padding: 12,
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {erro}
              </div>
            )}

            {ok && (
              <div
                style={{
                  background: "rgba(34, 197, 94, 0.10)",
                  border: "1px solid rgba(34, 197, 94, 0.22)",
                  color: "#166534",
                  padding: 12,
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                {ok}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                border: 0,
                cursor: loading ? "not-allowed" : "pointer",
                borderRadius: 14,
                padding: "12px 14px",
                fontWeight: 900,
                background: "linear-gradient(135deg, #f5c84c, #f59e0b)",
                color: "#10131a",
                boxShadow: "0 12px 30px rgba(245, 158, 11, 0.22)",
              }}
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 4,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                style={linkBtnStyle}
              >
                Voltar para login
              </button>

              <button
                type="button"
                onClick={() => alert("Em breve: termos e política")}
                style={linkBtnStyle}
              >
                Termos
              </button>
            </div>
          </form>

          <div
            style={{
              marginTop: 16,
              fontSize: 12,
              color: "#64748b",
              lineHeight: 1.5,
            }}
          >
            Ao criar a conta, você confirma que está acessando um ambiente do Instituto
            AlphaMind.
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 6,
  padding: 12,
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.12)",
  outline: "none",
  background: "#ffffff",
  color: "#0f172a",
};

const linkBtnStyle = {
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: "#0f172a",
  fontWeight: 800,
  fontSize: 13,
  textDecoration: "underline",
  textUnderlineOffset: 3,
};

export default Register;
