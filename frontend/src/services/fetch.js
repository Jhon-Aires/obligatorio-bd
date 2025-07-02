const defaultOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Asegura que las cookies de sesión se envíen
};

export const fetchFromApi = async (endpoint, options = {}) => {
  return fetch(`http://localhost:5001${endpoint}`, {
    ...defaultOptions,
    ...options,
  });
};
