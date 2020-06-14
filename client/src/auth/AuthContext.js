import React from 'react';

export const AuthContext = React.createContext({
    authUser: null,
    authErr: null,
    handleLogin: () => null,
});
