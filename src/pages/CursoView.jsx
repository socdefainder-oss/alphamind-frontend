import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import "../App.css";

export default function CursoView() {
  const { cursoId } = useParams();
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  const [curso, setCurso] = useState(null);
  const [aulaAtual, setAulaAtual] = useState(null);
  const [progresso, setProgresso] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedModulos, setExpandedModulos] = useState({});

  useEffect(() => {
    loadCurso();
    loadProgresso();
  }, [cursoId]);

  async function loadCurso() {
    try {
      const response = await api.get(`/api/aluno/cursos/${cursoId}`);
      setCurso(response.data);
      
      // Expandir todos os módulos por padrão
      const expanded = {};
      response.data.modulos?.forEach(mod => {
        expanded[mod.id] = true;
      });
      setExpandedModulos(expanded);
      
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
          aulasMap[aula.id] = aula.concluido;
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
      loadProgresso(); // Recarregar para atualizar contadores
    } catch (error) {
      console.error("Erro ao atualizar progresso:", error);
      alert("Erro ao atualizar progresso da aula");
    }
  }

  function toggleModulo(moduloId) {
    setExpandedModulos({
      ...expandedModulos,
      [moduloId]: !expandedModulos[moduloId]
    });
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
            style={{ borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          />
        );
      }
      
      // Video genérico
      return (
        <video 
          width="100%" 
          height="500" 
          controls 
          style={{ 
            borderRadius: "12px", 
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" 
          }}
        >
          <source src={aulaAtual.video_url} type="video/mp4" />
          Seu navegador não suporta video.
        </video>
      );
    }

    if (aulaAtual.descricao) {
      return (
        <div style={{
          background: "#f8fafc",
          padding: "30px",
          borderRadius: "12px",
          lineHeight: "1.8",
          whiteSpace: "pre-wrap",
          color: "#334155",
          fontSize: 15,
          border: "1px solid #e2e8f0"
        }}>
          {aulaAtual.descricao}
        </div>
      );
    }

    return (
      <div style={{
        textAlign: "center",
        padding: 60,
        color: "#94a3b8"
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
        <p>Conteúdo indisponível para esta aula</p>
      </div>
    );
  }

  if (loading || isLoading) {
    return (
      <div className="shell">
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "100vh",
          fontSize: 18,
          color: "#64748b"
        }}>
          Carregando curso...
        </div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="shell">
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "100vh",
          fontSize: 18,
          color: "#dc2626"
        }}>
          Curso não encontrado
        </div>
      </div>
    );
  }

  const totalAulas = curso.modulos?.reduce((sum, mod) => sum + (mod.aulas?.length || 0), 0) || 0;
  const aulasConcluidas = Object.values(progresso).filter(Boolean).length;
  const progressoPercentual = totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0;

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
                Transformação através do conhecimento
              </div>
            </div>
          </div>

          <nav className="nav">
            <a href="/dashboard">Home</a>
            <a href="/jornada">Jornada</a>
            <a href="/meus-cursos" style={{ background: "rgba(255,255,255,0.10)" }}>Cursos</a>
            <a href="/provas">Provas</a>
            <a href="/avisos">Avisos</a>
            <a href="/perfil">Perfil</a>

            <button className="btn btn-ghost" onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}>
              Sair
            </button>

            <button className="btn btn-primary" onClick={() => navigate("/meus-cursos")}>
              ← Voltar
            </button>
          </nav>
        </div>
      </header>

      <main style={{ padding: "30px", minHeight: "calc(100vh - 80px)", background: "#f8fafc" }}>
        {/* Hero Section */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "12px",
          padding: "16px 24px",
          marginBottom: "20px",
          color: "#fff"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <button 
              onClick={() => navigate("/meus-cursos")}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: 12,
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              ← Voltar para Meus Cursos
            </button>

            <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 6px 0" }}>
              {curso.titulo}
            </h1>
            
            {curso.descricao && (
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 12, lineHeight: 1.5 }}>
                {curso.descricao}
              </p>
            )}

            {/* Progresso */}
            <div style={{ 
              background: "rgba(255,255,255,0.1)", 
              borderRadius: "8px", 
              padding: "12px",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Seu Progresso no Curso</span>
                <span style={{ fontSize: 12, fontWeight: 800 }}>{progressoPercentual}%</span>
              </div>
              <div style={{ 
                height: 8, 
                borderRadius: 999, 
                background: "rgba(0,0,0,0.2)", 
                overflow: "hidden" 
              }}>
                <div style={{ 
                  width: `${progressoPercentual}%`, 
                  height: "100%", 
                  background: "linear-gradient(90deg, #f5c84c 0%, #f59e0b 100%)",
                  transition: "width 0.5s ease"
                }} />
              </div>
              <div style={{ marginTop: 5, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>
                {aulasConcluidas} de {totalAulas} aulas concluídas
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 30 }}>
            {/* Player de Vídeo */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "30px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"
              }}>
                {aulaAtual ? (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                        {aulaAtual.titulo}
                      </h2>
                      {aulaAtual.descricao && (
                        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                          {aulaAtual.descricao}
                        </p>
                      )}
                    </div>

                    {renderConteudoAula()}

                    <div style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "center" }}>
                      <button
                        onClick={() => toggleAulaConcluida(aulaAtual.id)}
                        style={{
                          flex: 1,
                          padding: "14px 28px",
                          borderRadius: "12px",
                          border: "none",
                          background: progresso[aulaAtual.id] 
                            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                            : "linear-gradient(135deg, #f5c84c 0%, #f59e0b 100%)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 16,
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
                        }}
                        onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                      >
                        {progresso[aulaAtual.id] ? "✓ Aula Concluída" : "Marcar como Concluída"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
                    <p style={{ fontSize: 16 }}>Selecione uma aula na lista ao lado para começar</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Módulos e Aulas */}
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
              maxHeight: "calc(100vh - 300px)",
              overflowY: "auto"
            }}>
              <h3 style={{ 
                fontSize: 18, 
                fontWeight: 800, 
                color: "#0f172a", 
                marginBottom: 20,
                borderBottom: "2px solid #e2e8f0",
                paddingBottom: 12
              }}>
                Conteúdo do Curso
              </h3>
              
              {curso.modulos && curso.modulos.map((modulo, idx) => {
                const aulasModulo = modulo.aulas || [];
                const aulasConcluidas = aulasModulo.filter(a => progresso[a.id]).length;
                const progressoModulo = aulasModulo.length > 0 
                  ? Math.round((aulasConcluidas / aulasModulo.length) * 100)
                  : 0;

                return (
                  <div key={modulo.id} style={{ marginBottom: 16 }}>
                    <div 
                      onClick={() => toggleModulo(modulo.id)}
                      style={{
                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                        borderRadius: "12px",
                        padding: "16px",
                        cursor: "pointer",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <div style={{
                          background: "linear-gradient(135deg, #f5c84c 0%, #f59e0b 100%)",
                          color: "#000",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: 12,
                          fontWeight: 800
                        }}>
                          Módulo {modulo.ordem}
                        </div>
                        <div style={{ flex: 1, fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                          {modulo.titulo}
                        </div>
                        <div style={{ fontSize: 18, color: "#64748b" }}>
                          {expandedModulos[modulo.id] ? "▼" : "▶"}
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1, background: "#e2e8f0", borderRadius: 999, height: 6, overflow: "hidden" }}>
                          <div style={{ 
                            width: `${progressoModulo}%`, 
                            height: "100%", 
                            background: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                            transition: "width 0.5s ease"
                          }} />
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                          {aulasConcluidas}/{aulasModulo.length} aulas
                        </div>
                      </div>
                    </div>
                    
                    {expandedModulos[modulo.id] && aulasModulo.map((aula) => (
                      <div
                        key={aula.id}
                        onClick={() => setAulaAtual(aula)}
                        style={{
                          marginLeft: 20,
                          marginTop: 8,
                          padding: "14px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          background: aulaAtual?.id === aula.id 
                            ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)"
                            : "#fff",
                          border: `2px solid ${aulaAtual?.id === aula.id ? "#3b82f6" : "#e2e8f0"}`,
                          borderLeft: progresso[aula.id] ? "4px solid #10b981" : "4px solid #e2e8f0",
                          transition: "all 0.2s",
                          display: "flex",
                          alignItems: "center",
                          gap: 12
                        }}
                        onMouseEnter={(e) => {
                          if (aulaAtual?.id !== aula.id) {
                            e.currentTarget.style.background = "#f8fafc";
                            e.currentTarget.style.borderColor = "#cbd5e1";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (aulaAtual?.id !== aula.id) {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.borderColor = "#e2e8f0";
                          }
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>
                            AULA {aula.ordem}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                            {aula.titulo}
                          </div>
                        </div>
                        {progresso[aula.id] && (
                          <div style={{
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "#fff",
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: 800
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}

              {(!curso.modulos || curso.modulos.length === 0) && (
                <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
                  <p>Nenhum módulo disponível ainda</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
