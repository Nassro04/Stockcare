import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && !config.url?.includes('/auth/login')) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepteur pour gérer les réponses 401 (Non autorisé / Token expiré)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('access_token');
        // On pourrait aussi nettoyer le store zustand ici si on avait accès
        // Mais rediriger vers login forcera l'utilisateur à se reconnecter
        window.location.href = '/login?expired=true';
        // Retourner une promesse qui ne se résout jamais pour empêcher l'exécution
        // du bloc catch dans les composants pendant la redirection
        return new Promise(() => { });
      }
    }
    return Promise.reject(error);
  }
);

export default api;
