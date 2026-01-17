import axios from "axios";

// Em DEV: pega do .env.local (se existir) ou cai no localhost
// Em PROD (Vercel): pega da variável VITE_API_URL configurada no painel
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (não autorizado) ou 403 (token inválido/expirado)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Remove o token inválido
      localStorage.removeItem("token");
      
      // Redireciona para login se não estiver já na página de login/registro
      if (!window.location.pathname.includes("/register") && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
