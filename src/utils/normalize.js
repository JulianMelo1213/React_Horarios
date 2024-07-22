// src/utils/normalize.js
export const normalizeString = (str) => {
    return str
      .normalize("NFD") // Normaliza caracteres Unicode
      .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
      .replace(/[^a-zA-Z0-9]/g, "") // Elimina caracteres especiales
      .toLowerCase(); // Convierte a minúsculas
  };
  