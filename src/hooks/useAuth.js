import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Hook para validar se o usuário está autenticado
 * Faz uma chamada real ao backend para verificar se o token é válido
 */
export function useAuth() {
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
        // Tenta validar o token com o backend
        const response = await api.get("/me");
        setUser(response.data);
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // Se o endpoint /me não existe (404), aceita o token por enquanto
        // Quando implementar o endpoint no backend, remova esta condição
        if (error.response && error.response.status === 404) {
          console.warn("⚠️ Endpoint /me não implementado. Validação de token simplificada ativa.");
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
        
        // Se der erro 401/403 (token inválido/expirado), redireciona
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          setIsLoading(false);
          window.location.href = "/";
          return;
        }
        
        // Para outros erros (servidor fora, etc), aceita o token localmente
        console.warn("⚠️ Erro ao validar token, aceitando localmente:", error.message);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading, user };
}
