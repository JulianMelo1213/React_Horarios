// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authServices';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = authService.isAuthenticated();
    return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
  };

export default PrivateRoute;

