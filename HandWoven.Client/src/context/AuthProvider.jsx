import React, { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = (token, userData) => {
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

