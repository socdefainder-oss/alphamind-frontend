import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

function AdminCursos() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    preco: "",
    duracao_meses: 12,
    ativo: true
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (user?.role !== "admin") {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      loadCursos();
    }
  }, [isAuthenticated, user]);

  const loadCursos = async () => {
    try {
      const response = await api.get("/admin/cursos");
      setCursos(response.data);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      alert("Erro ao carregar cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/cursos/${editingId}`, formData);
        alert("Curso atualizado com sucesso!");
      } else {
        await api.post("/admin/cursos", formData);
        alert("Curso criado com sucesso!");
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({ titulo: "", descricao: "", preco: "", duracao_meses: 12, ativo: true });
      loadCursos();
    } catch (error) {
      console.error("Erro ao salvar curso:", error);
      alert("Erro ao salvar curso: " + (error.response?.data?.error || error.message));
    }
  };

  const handleEdit = (curso) => {
    setFormData({
      titulo: curso.titulo,
      descricao: curso.descricao,
      preco: curso.preco_total,
      duracao_meses: curso.duracao_estimada_horas / 10 || 12,
      ativo: curso.ativo
    });
    setEditingId(curso.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja deletar este curso?")) return;

    try {
      await api.delete(`/admin/cursos/${id}`);
      alert("Curso deletado com sucesso!");
      loadCursos();
    } catch (error) {
      console.error("Erro ao deletar curso:", error);
      alert("Erro ao deletar curso");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#0a0a0a", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#1a1a1a", padding: "20px", borderBottom: "2px solid #00d4ff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>⚙️ Painel Administrativo</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", backgroundColor: "#444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              🏠 Portal Aluno
            </button>
            <button onClick={logout} style={{ padding: "10px 20px", backgroundColor: "#d32f2f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              🚪 Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px" }}>📚 Gerenciar Cursos</h2>
          <button 
            onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ titulo: "", descricao: "", preco: "", duracao_meses: 12, ativo: true }); }}
            style={{ padding: "12px 24px", backgroundColor: "#00d4ff", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            {showForm ? "❌ Cancelar" : "➕ Novo Curso"}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div style={{ backgroundColor: "#1a1a1a", padding: "30px", borderRadius: "8px", marginBottom: "30px", border: "1px solid #00d4ff" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "20px" }}>{editingId ? "✏️ Editar Curso" : "➕ Novo Curso"}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Título *</label>
                  <input 
                    type="text" 
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                    style={{ width: "100%", padding: "12px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", borderRadius: "4px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Descrição *</label>
                  <textarea 
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                    rows="4"
                    style={{ width: "100%", padding: "12px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", borderRadius: "4px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Preço (R$) *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                      required
                      style={{ width: "100%", padding: "12px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", borderRadius: "4px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Duração (meses)</label>
                    <input 
                      type="number"
                      value={formData.duracao_meses}
                      onChange={(e) => setFormData({ ...formData, duracao_meses: e.target.value })}
                      style={{ width: "100%", padding: "12px", backgroundColor: "#2a2a2a", color: "#fff", border: "1px solid #444", borderRadius: "4px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input 
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                    id="ativo"
                  />
                  <label htmlFor="ativo">Curso ativo (visível para alunos)</label>
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} style={{ padding: "12px 24px", backgroundColor: "#444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button type="submit" style={{ padding: "12px 24px", backgroundColor: "#00d4ff", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
                    {editingId ? "💾 Atualizar" : "✅ Criar"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Cursos */}
        <div style={{ display: "grid", gap: "20px" }}>
          {cursos.length === 0 ? (
            <div style={{ backgroundColor: "#1a1a1a", padding: "40px", textAlign: "center", borderRadius: "8px" }}>
              <p style={{ fontSize: "18px", color: "#888" }}>Nenhum curso cadastrado</p>
            </div>
          ) : (
            cursos.map((curso) => (
              <div key={curso.id} style={{ backgroundColor: "#1a1a1a", padding: "20px", borderRadius: "8px", border: "1px solid #333" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "20px", marginBottom: "10px", color: "#00d4ff" }}>{curso.titulo}</h3>
                    <p style={{ color: "#aaa", marginBottom: "15px" }}>{curso.descricao}</p>
                    <div style={{ display: "flex", gap: "20px", fontSize: "14px", color: "#888" }}>
                      <span>💰 R$ {parseFloat(curso.preco_total).toFixed(2)}</span>
                      <span>📚 {curso.total_modulos} módulos</span>
                      <span>{curso.ativo ? "🟢 Ativo" : "🔴 Inativo"}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => navigate(`/admin/cursos/${curso.id}/modulos`)} style={{ padding: "8px 16px", backgroundColor: "#444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      📑 Módulos
                    </button>
                    <button onClick={() => handleEdit(curso)} style={{ padding: "8px 16px", backgroundColor: "#ffa726", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      ✏️ Editar
                    </button>
                    <button onClick={() => handleDelete(curso.id)} style={{ padding: "8px 16px", backgroundColor: "#d32f2f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                      🗑️ Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminCursos;
