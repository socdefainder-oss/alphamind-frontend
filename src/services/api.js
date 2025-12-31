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

export default api;
