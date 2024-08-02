import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const API_URL = 'http://localhost:5074/api/Usuario';
const regex = /"([^"]+)":\s*"([^"]+)"/g;

// Función para extraer todos los pares clave-valor del token
const extractValuesFromToken = (token) => {
    const decodedToken = JSON.stringify(jwtDecode(token)); // Convertir el token decodificado a string para aplicar la regex
    const values = {};
    let match;

    while ((match = regex.exec(decodedToken)) !== null) {
        values[match[1]] = match[2]; // Guardar el par clave-valor en el objeto
    }

    return values; // Retornar todos los pares clave-valor encontrados
};

const login = async (loginDTO) => {
    try {
        const response = await axios.post(`${API_URL}/login`, loginDTO);
        if (response.data.token) {
            const values = extractValuesFromToken(response.data.token);
            response.token = JSON.stringify(response.data)
            response.data.role = values['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; // Obtener el rol de los valores extraídos
        }
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error en el login:", error);
        throw error;
    }
};

const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
};

const isAuthenticated = () => {
    return !!sessionStorage.getItem('token');
}

const getRole = () => {
    return sessionStorage.getItem('role');
}

const authService = {
    login,
    logout,
    isAuthenticated,
    getRole
};

export default authService;
