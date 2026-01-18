import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Hook para validar se o usuário está autenticado
 * Faz uma chamada real ao backend para verificar se o token é válido
 */
function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        window.location.href = "/";
        return;
      }

      try {
        // Valida o token com o backend
        const response = await api.get("/me");
        setUser(response.data);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // Se der erro 401/403 (token inválido/expirado), redireciona
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.log("Token inválido ou expirado, redirecionando para login...");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setIsLoading(false);
          window.location.href = "/";
          return;
        }
        
        // Para outros erros (servidor fora, erro de rede), aceita o token localmente como fallback
        console.warn("⚠️ Erro ao validar token com backend, aceitando localmente:", error.message);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading, user };
}

export default useAuth;
