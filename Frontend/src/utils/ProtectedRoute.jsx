import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext.js';
import Loader from '../components/Loader.jsx';
const ProtectedRoute = () => {
    const { userData, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !userData) {
            navigate('/');
        }
    }, [loading, userData, navigate]);

    if (loading) {
        return <Loader />;
    }

    if (!userData) {
        return null; // or splash screen
    }

    return <Outlet />;
};

export default ProtectedRoute;
