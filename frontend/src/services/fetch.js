const defaultOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include", // Asegura que las cookies de sesión se envíen
};

export const fetchFromApi = async (endpoint, options = {}) => {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  // Log para depuración
  console.log("URL:", `http://localhost:5001${endpoint}`);
  console.log("Opciones:", mergedOptions);

  return fetch(`http://localhost:5001${endpoint}`, mergedOptions);
};
