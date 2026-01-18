import React, { useState } from 'react';
import { AuthContext } from './AuthContext';
import {jwtDecode} from "jwt-decode";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");

        if(!token) return null;

        const decoded = jwtDecode(token);

        return {
            userId: decoded.sub,
            email: decoded.email,
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        }
        // return token ? jwtDecode(token) : null;
    });

    const loginUser = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);

        setUser({
            userId: decoded.sub,
      email: decoded.email,
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        })
        // setUser(decoded);
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

