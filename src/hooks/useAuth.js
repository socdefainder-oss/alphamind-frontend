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
        // Pode ser um endpoint como /me, /verify, /profile, etc.
        const response = await api.get("/me");
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        // Se der erro (token inválido/expirado), o interceptor já vai limpar
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading, user };
}
