// src/components/Login.js
import React, { useState } from 'react';
import authService from "../services/authServices";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login({ nombreUsuario, password });
            console.log("Login exitoso:", response);

            if (response.token && response.role) {
                sessionStorage.setItem('token', response.token);
                sessionStorage.setItem('role', response.role);

                console.log(response.role)
                // Redirigir al usuario según su rol
                switch (response.role) {
                    case 'Administrador':
                        navigate('/');
                        break;
                    case 'Estudiante': console.log('hola')
                        navigate('/');
                        break;
                    case 'Profesor':
                        navigate('/');
                        break;
                    default:
                        navigate('/login');
                        break;
                }
                window.dispatchEvent(new Event('roleUpdated'))
            } else {
                setError("Error en la respuesta del servidor");
            }
        } catch (error) {
            console.error("Error durante el login:", error);
            setError("Usuario no encontrado y/o contraseña incorrecta");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Nombre de Usuario:</label>
                    <input 
                        type="text" 
                        value={nombreUsuario} 
                        onChange={(e) => setNombreUsuario(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
