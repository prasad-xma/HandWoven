import React, { createContext } from 'react';

export const AuthContext = createContext({
    user: null,
    loginUser: () => {
        throw new Error("loginUser called outside");

    },
    logout: () => {
    throw new Error("logout called outside AuthProvider");
    
  },
});

