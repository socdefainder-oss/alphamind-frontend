import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

export default function AdminAulas() {
  const { moduloId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [modulo, setModulo] = useState(null);
  const [aulas, setAulas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "video",
    conteudo_url: "",
    conteudo_texto: "",
    duracao_minutos: "",
    ordem: "",
  });

  // Redirecionar se não for admin
  useEffect(() => {
    if (!isLoading && user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  // Carregar módulo e aulas
  useEffect(() => {
    if (moduloId) {
      loadModulo();
      loadAulas();
    }
  }, [moduloId]);

  async function loadModulo() {
    try {
      const response = await api.get(`/admin/modulos/${moduloId}`);
      setModulo(response.data);
    } catch (error) {
      console.error("Erro ao carregar módulo:", error);
      alert("Erro ao carregar dados do módulo");
    }
  }

  async function loadAulas() {
    try {
      const response = await api.get(`/admin/modulos/${moduloId}/aulas`);
      setAulas(response.data);
    } catch (error) {
      console.error("Erro ao carregar aulas:", error);
      alert("Erro ao carregar aulas");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.titulo || !formData.ordem) {
      alert("Preencha título e ordem da aula");
      return;
    }

    // Validação por tipo
    if (formData.tipo === "video" || formData.tipo === "pdf") {
      if (!formData.conteudo_url) {
        alert(`Preencha a URL do ${formData.tipo}`);
        return;
      }
    } else if (formData.tipo === "texto") {
      if (!formData.conteudo_texto) {
        alert("Preencha o conteúdo da aula");
        return;
      }
    }

    try {
      if (editingId) {
        // Atualizar aula existente
        await api.put(`/admin/aulas/${editingId}`, formData);
        alert("Aula atualizada com sucesso!");
      } else {
        // Criar nova aula
        await api.post(`/admin/modulos/${moduloId}/aulas`, formData);
        alert("Aula criada com sucesso!");
      }

      // Limpar form e recarregar lista
      setFormData({
        titulo: "",
        tipo: "video",
        conteudo_url: "",
        conteudo_texto: "",
        duracao_minutos: "",
        ordem: "",
      });
      setEditingId(null);
      loadAulas();
    } catch (error) {
      console.error("Erro ao salvar aula:", error);
      alert("Erro ao salvar aula: " + (error.response?.data?.error || error.message));
    }
  }

  function handleEdit(aula) {
    setEditingId(aula.id);
    setFormData({
      titulo: aula.titulo,
      tipo: aula.tipo === 'gravado' ? 'video' : aula.tipo, // mapear de volta
      conteudo_url: aula.video_url || "",
      conteudo_texto: aula.descricao || "",
      duracao_minutos: aula.duracao_minutos || "",
      ordem: aula.ordem,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({
      titulo: "",
      tipo: "video",
      conteudo_url: "",
      conteudo_texto: "",
      duracao_minutos: "",
      ordem: "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir esta aula?")) {
      return;
    }

    try {
      await api.delete(`/admin/aulas/${id}`);
      alert("Aula excluída com sucesso!");
      loadAulas();
    } catch (error) {
      console.error("Erro ao excluir aula:", error);
      alert("Erro ao excluir aula: " + (error.response?.data?.error || error.message));
    }
  }

  function getTipoIcon(tipo) {
    switch (tipo) {
      case "video": return "🎥";
      case "pdf": return "📄";
      case "texto": return "📝";
      default: return "📚";
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
        <button
          onClick={() => {
            if (modulo?.curso_id) {
              navigate(`/admin/cursos/${modulo.curso_id}/modulos`);
            } else {
              navigate("/admin/cursos");
            }
          }}
          style={styles.backButton}
        >
          ← Voltar para Módulos
        </button>
        <h1 style={styles.title}>
          {modulo ? `Aulas: ${modulo.titulo}` : "Gerenciar Aulas"}
        </h1>
      </div>

      {/* Formulário */}
      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>
          {editingId ? "✏️ Editar Aula" : "➕ Nova Aula"}
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formRow}>
            <div style={{ ...styles.formGroup, flex: 2 }}>
              <label style={styles.label}>Título da Aula *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                style={styles.input}
                placeholder="Ex: Introdução à Doutrina da Salvação"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                style={styles.input}
              >
                <option value="video">🎥 Vídeo</option>
                <option value="pdf">📄 PDF</option>
                <option value="texto">📝 Texto</option>
              </select>
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

          {(formData.tipo === "video" || formData.tipo === "pdf") && (
            <div style={styles.formGroup}>
              <label style={styles.label}>
                URL do {formData.tipo === "video" ? "Vídeo" : "PDF"} *
              </label>
              <input
                type="url"
                value={formData.conteudo_url}
                onChange={(e) => setFormData({ ...formData, conteudo_url: e.target.value })}
                style={styles.input}
                placeholder={
                  formData.tipo === "video"
                    ? "https://www.youtube.com/watch?v=..."
                    : "https://example.com/arquivo.pdf"
                }
              />
            </div>
          )}

          {formData.tipo === "texto" && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Conteúdo da Aula *</label>
              <textarea
                value={formData.conteudo_texto}
                onChange={(e) => setFormData({ ...formData, conteudo_texto: e.target.value })}
                style={{ ...styles.input, minHeight: "200px", resize: "vertical" }}
                placeholder="Digite o conteúdo da aula em texto..."
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Duração (minutos)</label>
            <input
              type="number"
              value={formData.duracao_minutos}
              onChange={(e) => setFormData({ ...formData, duracao_minutos: e.target.value })}
              style={styles.input}
              placeholder="Ex: 45"
              min="0"
            />
          </div>

          <div style={styles.formActions}>
            <button type="submit" style={styles.submitButton}>
              {editingId ? "💾 Salvar Alterações" : "➕ Criar Aula"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} style={styles.cancelButton}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Aulas */}
      <div style={styles.listCard}>
        <h2 style={styles.listTitle}>📚 Aulas Cadastradas ({aulas.length})</h2>
        {aulas.length === 0 ? (
          <p style={styles.emptyMessage}>Nenhuma aula cadastrada ainda.</p>
        ) : (
          <div style={styles.list}>
            {aulas.map((aula) => (
              <div key={aula.id} style={styles.aulaCard}>
                <div style={styles.aulaHeader}>
                  <span style={styles.ordem}>#{aula.ordem}</span>
                  <span style={styles.tipoIcon}>{getTipoIcon(aula.tipo)}</span>
                  <h3 style={styles.aulaTitle}>{aula.titulo}</h3>
                  <span style={styles.duracao}>
                    ⏱️ {aula.duracao_minutos || 0} min
                  </span>
                </div>

                <div style={styles.aulaContent}>
                  {aula.tipo === "gravado" && aula.video_url && (
                    <p style={styles.url}>
                      🔗 <a href={aula.video_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        {aula.video_url}
                      </a>
                    </p>
                  )}
                  {aula.descricao && (
                    <p style={styles.textoPreview}>
                      {aula.descricao.substring(0, 200)}
                      {aula.descricao.length > 200 ? "..." : ""}
                    </p>
                  )}
                </div>

                <div style={styles.aulaActions}>
                  <button onClick={() => handleEdit(aula)} style={styles.editButton}>
                    ✏️ Editar
                  </button>
                  <button onClick={() => handleDelete(aula.id)} style={styles.deleteButton}>
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
    gridTemplateColumns: "2fr 1fr auto",
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
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  aulaCard: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #333",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s",
  },
  aulaHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  ordem: {
    backgroundColor: "#00d4ff",
    color: "#000",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  tipoIcon: {
    fontSize: "20px",
  },
  aulaTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0",
    flex: 1,
  },
  duracao: {
    fontSize: "14px",
    color: "#888",
  },
  aulaContent: {
    marginBottom: "15px",
  },
  url: {
    color: "#aaa",
    fontSize: "14px",
    wordBreak: "break-all",
  },
  link: {
    color: "#00d4ff",
    textDecoration: "none",
  },
  textoPreview: {
    color: "#aaa",
    fontSize: "14px",
    lineHeight: "1.5",
    whiteSpace: "pre-wrap",
  },
  aulaActions: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    color: "#00d4ff",
    border: "1px solid #00d4ff",
    padding: "8px 16px",
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
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s",
  },
};
