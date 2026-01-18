import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

export default function AdminModulos() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [curso, setCurso] = useState(null);
  const [modulos, setModulos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    ordem: "",
    duracao_estimada_horas: "",
  });

  // Redirecionar se não for admin
  useEffect(() => {
    if (!isLoading && user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  // Carregar curso e módulos
  useEffect(() => {
    if (cursoId) {
      loadCurso();
      loadModulos();
    }
  }, [cursoId]);

  async function loadCurso() {
    try {
      const response = await api.get(`/admin/cursos/${cursoId}`);
      setCurso(response.data);
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
      alert("Erro ao carregar dados do curso");
    }
  }

  async function loadModulos() {
    try {
      const response = await api.get(`/admin/cursos/${cursoId}/modulos`);
      setModulos(response.data);
    } catch (error) {
      console.error("Erro ao carregar módulos:", error);
      alert("Erro ao carregar módulos");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.titulo || !formData.ordem) {
      alert("Preencha título e ordem do módulo");
      return;
    }

    try {
      if (editingId) {
        // Atualizar módulo existente
        await api.put(`/admin/modulos/${editingId}`, formData);
        alert("Módulo atualizado com sucesso!");
      } else {
        // Criar novo módulo
        await api.post(`/admin/cursos/${cursoId}/modulos`, formData);
        alert("Módulo criado com sucesso!");
      }

      // Limpar form e recarregar lista
      setFormData({ titulo: "", descricao: "", ordem: "", duracao_estimada_horas: "" });
      setEditingId(null);
      loadModulos();
    } catch (error) {
      console.error("Erro ao salvar módulo:", error);
      alert("Erro ao salvar módulo: " + (error.response?.data?.error || error.message));
    }
  }

  function handleEdit(modulo) {
    setEditingId(modulo.id);
    setFormData({
      titulo: modulo.titulo,
      descricao: modulo.descricao || "",
      ordem: modulo.ordem,
      duracao_estimada_horas: modulo.duracao_estimada_horas || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({ titulo: "", descricao: "", ordem: "", duracao_estimada_horas: "" });
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir este módulo? Todas as aulas serão excluídas também.")) {
      return;
    }

    try {
      await api.delete(`/admin/modulos/${id}`);
      alert("Módulo excluído com sucesso!");
      loadModulos();
    } catch (error) {
      console.error("Erro ao excluir módulo:", error);
      alert("Erro ao excluir módulo: " + (error.response?.data?.error || error.message));
    }
  }

  if (isLoading) {
    return <div style={styles.container}>Carregando...</div>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate("/admin/cursos")} style={styles.backButton}>
          ← Voltar para Cursos
        </button>
        <h1 style={styles.title}>
          {curso ? `Módulos de: ${curso.titulo}` : "Gerenciar Módulos"}
        </h1>
      </div>

      {/* Formulário */}
      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>
          {editingId ? "✏️ Editar Módulo" : "➕ Novo Módulo"}
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Título do Módulo *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                style={styles.input}
                placeholder="Ex: Introdução à Teologia Sistemática"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Ordem *</label>
              <input
                type="number"
                value={formData.ordem}
                onChange={(e) => setFormData({ ...formData, ordem: e.target.value })}
                style={styles.input}
                placeholder="1"
                min="1"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              style={{ ...styles.input, minHeight: "100px", resize: "vertical" }}
              placeholder="Descreva o conteúdo deste módulo..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Duração Estimada (horas)</label>
            <input
              type="number"
              value={formData.duracao_estimada_horas}
              onChange={(e) => setFormData({ ...formData, duracao_estimada_horas: e.target.value })}
              style={styles.input}
              placeholder="Ex: 8"
              min="0"
              step="0.5"
            />
          </div>

          <div style={styles.formActions}>
            <button type="submit" style={styles.submitButton}>
              {editingId ? "💾 Salvar Alterações" : "➕ Criar Módulo"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Módulos */}
      <div style={styles.listCard}>
        <h2 style={styles.listTitle}>📚 Módulos Cadastrados ({modulos.length})</h2>
        {modulos.length === 0 ? (
          <p style={styles.emptyMessage}>Nenhum módulo cadastrado ainda.</p>
        ) : (
          <div style={styles.grid}>
            {modulos.map((modulo) => (
              <div key={modulo.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.ordem}>#{modulo.ordem}</span>
                  <h3 style={styles.cardTitle}>{modulo.titulo}</h3>
                </div>
                {modulo.descricao && <p style={styles.cardDescription}>{modulo.descricao}</p>}
                <div style={styles.cardInfo}>
                  <span>⏱️ {modulo.duracao_estimada_horas || 0}h</span>
                  <span>📝 {modulo.total_aulas || 0} aulas</span>
                </div>
                <div style={styles.cardActions}>
                  <button
                    onClick={() => navigate(`/admin/modulos/${modulo.id}/aulas`)}
                    style={styles.aulasButton}
                  >
                    📚 Aulas
                  </button>
                  <button onClick={() => handleEdit(modulo)} style={styles.editButton}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(modulo.id)} style={styles.deleteButton}>
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    padding: "20px",
  },
  header: {
    marginBottom: "30px",
  },
  backButton: {
    backgroundColor: "#1a1a1a",
    color: "#00d4ff",
    border: "1px solid #00d4ff",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "15px",
    transition: "all 0.3s",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0",
    background: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  formCard: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "30px",
  },
  formTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#00d4ff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    color: "#aaa",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "16px",
    color: "#fff",
    outline: "none",
  },
  formActions: {
    display: "flex",
    gap: "10px",
  },
  submitButton: {
    backgroundColor: "#00d4ff",
    color: "#000",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s",
  },
  cancelButton: {
    backgroundColor: "#ff4444",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s",
  },
  listCard: {
    backgroundColor: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "30px",
  },
  listTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#fff",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#666",
    fontSize: "16px",
    padding: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  ordem: {
    backgroundColor: "#00d4ff",
    color: "#000",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
    flex: 1,
  },
  cardDescription: {
    color: "#aaa",
    fontSize: "14px",
    marginBottom: "15px",
    lineHeight: "1.4",
  },
  cardInfo: {
    display: "flex",
    gap: "15px",
    fontSize: "14px",
    color: "#888",
    marginBottom: "15px",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
  },
  aulasButton: {
    flex: 1,
    backgroundColor: "#00d4ff",
    color: "#000",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.3s",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    color: "#00d4ff",
    border: "1px solid #00d4ff",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    color: "#ff4444",
    border: "1px solid #ff4444",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
  },
};
