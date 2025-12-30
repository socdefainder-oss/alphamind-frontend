import { useState } from "react";
import api from "../services/api";

function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setErro("");
    setMsg("");

    try {
      await api.post("/register", { nome, email, senha });
      setMsg("Cadastro realizado com sucesso! Agora faça login.");
    } catch {
      setErro("Erro ao cadastrar. Verifique os dados.");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Cadastro — Instituto AlphaMind</h2>

      <form onSubmit={handleRegister}>
        <input
          placeholder="Nome completo"
          onChange={e => setNome(e.target.value)}
        /><br /><br />

        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Senha"
          onChange={e => setSenha(e.target.value)}
        /><br /><br />

        <button type="submit">Cadastrar</button>
      </form>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}

export default Register;
