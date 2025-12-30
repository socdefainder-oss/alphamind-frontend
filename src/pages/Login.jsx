import { useState } from "react";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await api.post("/login", { email, senha });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setErro("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h2>Instituto AlphaMind</h2>
      <p>Acesse sua conta para continuar</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {erro && <p style={{ color: "red", marginTop: 10 }}>{erro}</p>}

      <p style={{ marginTop: 20 }}>
        Não tem conta?{" "}
        <a href="/register">Cadastre-se</a>
      </p>
    </div>
  );
}

export default Login;
