import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";

export default function CursoView() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  const [curso, setCurso] = useState(null);
  const [aulaAtual, setAulaAtual] = useState(null);
  const [progresso, setProgresso] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurso();
    loadProgresso();
  }, [cursoId]);

  async function loadCurso() {
    try {
      const response = await api.get(`/api/aluno/cursos/${cursoId}`);
      setCurso(response.data);
      
      // Selecionar primeira aula do primeiro módulo
      if (response.data.modulos && response.data.modulos[0]?.aulas && response.data.modulos[0].aulas[0]) {
        setAulaAtual(response.data.modulos[0].aulas[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
      alert("Erro ao carregar curso");
    } finally {
      setLoading(false);
    }
  }

  async function loadProgresso() {
    try {
      const response = await api.get(`/api/aluno/progresso/${cursoId}`);
      
      // Criar mapa de aulas concluídas
      const aulasMap = {};
      for (const modulo of response.data.modulos) {
        const aulasRes = await api.get(`/api/aluno/modulos/${modulo.modulo_id}/progresso`);
        aulasRes.data.forEach(aula => {
          aulasMap[aula.id] = aula.concluida;
        });
      }
      setProgresso(aulasMap);
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  }

  async function toggleAulaConcluida(aulaId) {
    try {
      if (progresso[aulaId]) {
        await api.post(`/api/aluno/aulas/${aulaId}/desconcluir`);
      } else {
        await api.post(`/api/aluno/aulas/${aulaId}/concluir`);
      }
      setProgresso({ ...progresso, [aulaId]: !progresso[aulaId] });
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      alert("Erro ao atualizar progresso da aula");
    }
  }

  function renderConteudoAula() {
    if (!aulaAtual) return <p>Selecione uma aula</p>;

    if (aulaAtual.tipo === "gravado" && aulaAtual.video_url) {
      // Detectar se é YouTube
      if (aulaAtual.video_url.includes("youtube.com") || aulaAtual.video_url.includes("youtu.be")) {
        let videoId = "";
        
        // Formato: https://www.youtube.com/watch?v=VIDEO_ID
        if (aulaAtual.video_url.includes("v=")) {
          videoId = aulaAtual.video_url.split("v=")[1].split("&")[0];
        } 
        // Formato: https://youtu.be/VIDEO_ID
        else if (aulaAtual.video_url.includes("youtu.be/")) {
          videoId = aulaAtual.video_url.split("youtu.be/")[1].split("?")[0];
        }
        // Formato: https://www.youtube.com/live/VIDEO_ID
        else if (aulaAtual.video_url.includes("/live/")) {
          videoId = aulaAtual.video_url.split("/live/")[1].split("?")[0];
        }
        // Formato: https://www.youtube.com/embed/VIDEO_ID
        else if (aulaAtual.video_url.includes("/embed/")) {
          videoId = aulaAtual.video_url.split("/embed/")[1].split("?")[0];
        }
        
        console.log("URL original:", aulaAtual.video_url);
        console.log("Video ID extraído:", videoId);
        
        if (!videoId) {
          return (
            <div style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              color: "#dc2626"
            }}>
              <p>Erro: URL do YouTube inválida. Por favor, verifique o link do vídeo.</p>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>
                URL fornecida: {aulaAtual.video_url}
              </p>
            </div>
          );
        }
        
        return (
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "12px" }}
          />
        );
      }
      
      // Video genérico
      return (
        <video width="100%" height="500" controls style={{ borderRadius: "12px" }}>
          <source src={aulaAtual.video_url} type="video/mp4" />
          Seu navegador não suporta video.
        </video>
      );
    }

    if (aulaAtual.descricao) {
      return (
        <div style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          lineHeight: "1.8",
          whiteSpace: "pre-wrap"
        }}>
          {aulaAtual.descricao}
        </div>
      );
    }

    return <p>Conteúdo indisponível</p>;
  }

  if (loading || isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Carregando curso...</div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>Curso não encontrado</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate("/meus-cursos")} style={styles.backButton}>
          ← Voltar para Meus Cursos
        </button>
        <h1 style={styles.title}>{curso.titulo}</h1>
      </div>

      <div style={styles.content}>
        {/* Player de aula */}
        <div style={styles.player}>
          <h2 style={styles.aulaTitle}>{aulaAtual?.titulo || "Selecione uma aula"}</h2>
          {renderConteudoAula()}
          
          {aulaAtual && (
            <div style={styles.aulaActions}>
              <button
                onClick={() => toggleAulaConcluida(aulaAtual.id)}
                style={{
                  ...styles.button,
                  background: progresso[aulaAtual.id] ? "#10b981" : "#00d4ff"
                }}
              >
                {progresso[aulaAtual.id] ? "✓ Aula Concluída" : "Marcar como concluída"}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar com módulos e aulas */}
        <div style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>Conteúdo do Curso</h3>
          
          {curso.modulos && curso.modulos.map(modulo => (
            <div key={modulo.id} style={styles.modulo}>
              <div style={styles.moduloHeader}>
                <span style={styles.moduloOrdem}>#{modulo.ordem}</span>
                <span style={styles.moduloTitulo}>{modulo.titulo}</span>
              </div>
              
              {modulo.aulas && modulo.aulas.map(aula => (
                <div
                  key={aula.id}
                  onClick={() => setAulaAtual(aula)}
                  style={{
                    ...styles.aula,
                    background: aulaAtual?.id === aula.id ? "#e0f2fe" : "#fff",
                    borderLeft: progresso[aula.id] ? "4px solid #10b981" : "4px solid transparent"
                  }}
                >
                  <div style={styles.aulaInfo}>
                    <span style={styles.aulaOrdem}>Aula {aula.ordem}</span>
                    <span style={styles.aulaTitulo}>{aula.titulo}</span>
                  </div>
                  {progresso[aula.id] && (
                    <span style={styles.check}>✓</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
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
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0",
    background: "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 350px",
    gap: "20px",
  },
  player: {
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    padding: "20px",
  },
  aulaTitle: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#fff",
  },
  aulaActions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  sidebar: {
    backgroundColor: "#1a1a1a",
    borderRadius: "12px",
    padding: "20px",
    maxHeight: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  sidebarTitle: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#00d4ff",
  },
  modulo: {
    marginBottom: "20px",
  },
  moduloHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
    padding: "10px",
    background: "#2a2a2a",
    borderRadius: "8px",
  },
  moduloOrdem: {
    backgroundColor: "#00d4ff",
    color: "#000",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  moduloTitulo: {
    fontWeight: "bold",
    fontSize: "14px",
  },
  aula: {
    padding: "12px",
    marginBottom: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aulaInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  aulaOrdem: {
    fontSize: "11px",
    color: "#888",
  },
  aulaTitulo: {
    fontSize: "14px",
    color: "#000",
  },
  check: {
    color: "#10b981",
    fontSize: "18px",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "50px",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "50px",
    color: "#ff4444",
  },
};
