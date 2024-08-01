import axios from 'axios';

const API_URL = 'http://localhost:5074/api/Usuario';

const login = async (loginDTO) => {
    try {
        const response = await axios.post(`${API_URL}/login`, loginDTO);
        if (response.data.token) {
            sessionStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        console.error("Error en el login:", error);
        throw error;
    }
};

const logout = () => {
    sessionStorage.removeItem('user');
};

const authService = {
    login,
    logout,
};

export default authService;