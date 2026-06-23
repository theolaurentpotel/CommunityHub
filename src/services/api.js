// Service central pour tous les appels à l'API CommunityHub.
// Chaque requête envoie obligatoirement la clé de projet (X-Project-Key)
// et, si l'utilisateur est connecté, son token (X-Auth-Token).

const API_URL = import.meta.env.VITE_API_URL;
const PROJECT_KEY = import.meta.env.VITE_PROJECT_KEY;

const TOKEN_KEY = 'ch_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Fonction de bas niveau : construit les headers, envoie la requête,
// parse le JSON et lève une erreur lisible si le serveur répond en échec.
async function request(endpoint, { method = 'GET', body, auth = true } = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Project-Key': PROJECT_KEY,
  };

  const token = getToken();
  if (auth && token) {
    headers['X-Auth-Token'] = token;
  }

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    throw new Error("Impossible de joindre le serveur. Vérifie ta connexion.");
  }

  // Certaines réponses (ex: erreurs serveur) peuvent ne pas être du JSON valide.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || data.error || `Erreur ${response.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (endpoint, opts) => request(endpoint, { ...opts, method: 'GET' }),
  post: (endpoint, body, opts) => request(endpoint, { ...opts, method: 'POST', body }),
};
