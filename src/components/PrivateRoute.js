// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component }) => {
    const isAuthenticated = !!sessionStorage.getItem('user');
    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;

