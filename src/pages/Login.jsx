import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se já tiver token, verifica role e redireciona
    async function checkToken() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userRes = await api.get("/me");
          if (userRes.data.role === "admin") {
            navigate("/admin/cursos");
          } else {
            navigate("/dashboard");
          }
        } catch {
          // Token inválido, fica na página de login
          localStorage.removeItem("token");
        }
      }
    }
    checkToken();
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await api.post("/login", { email, senha });
      localStorage.setItem("token", res.data.token);
      
      // Buscar dados do usuário para verificar role
      const userRes = await api.get("/me");
      
      // Redirecionar baseado no role
      if (userRes.data.role === "admin") {
        navigate("/admin/cursos");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      // Tratamento mais específico de erros
      if (err.response) {
        if (err.response.status === 401) {
          setErro("Email ou senha inválidos");
        } else if (err.response.status === 403) {
          setErro("Sua conta foi suspensa. Entre em contato com o Instituto");
        } else if (err.response.status === 500) {
          setErro("Erro no servidor. Tente novamente em instantes");
        } else {
          setErro("Erro ao fazer login. Verifique os dados e tente novamente");
        }
      } else if (err.request) {
        setErro("Sem conexão com o servidor. Verifique sua internet");
      } else {
        setErro("Erro inesperado. Tente novamente");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
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
        style={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        {/* Lado esquerdo (branding) */}
        <div
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
          {/* brilho decorativo */}
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
                  background: "linear-gradient(135deg, #f5c84c, #f59e0b)",
                  boxShadow: "0 10px 25px rgba(245, 158, 11, 0.25)",
                }}
              />
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
                Portal do Aluno
              </h1>

              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  fontSize: 14.5,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.6,
                  maxWidth: 420,
                }}
              >
                Acesse seus cursos, acompanhe sua jornada, realize provas e
                mantenha sua matrícula em dia — tudo em um só lugar.
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
                { t: "Cursos em vídeo", s: "Aulas e módulos organizados" },
                { t: "Jornada", s: "Acompanhe seu progresso" },
                { t: "Provas", s: "Avaliações e resultados" },
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

        {/* Lado direito (form) */}
        <div
          style={{
            borderRadius: 22,
            padding: 28,
            background: "#ffffff",
            boxShadow: "0 18px 60px rgba(15, 23, 42, 0.10)",
            border: "1px solid rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ marginBottom: 14 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#0f172a",
              }}
            >
              Entrar
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
              Use seu email e senha cadastrados para acessar o portal.
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: "grid", gap: 12 }}>
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
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
                style={inputStyle}
              />
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
              {loading ? "Entrando..." : "Entrar"}
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
                onClick={() => alert("Em breve: recuperação de senha")}
                style={linkBtnStyle}
              >
                Esqueci minha senha
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = "/register")}
                style={linkBtnStyle}
              >
                Criar conta
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
            Ao entrar, você confirma que está acessando um ambiente do Instituto
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

export default Login;
