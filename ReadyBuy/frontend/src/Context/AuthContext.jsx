import React, {
    createContext,
    useState,
    useEffect,
} from "react";

export const AuthContext =
    createContext();

export const AuthProvider = ({
    children,
}) => {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const savedUser =
            localStorage.getItem(
                "user"
            );

        if (savedUser) {
            setUser(
                JSON.parse(savedUser)
            );
        }

        setLoading(false);

    }, []);

    const login = (
        userData,
        accessToken,
        refreshToken
    ) => {

        localStorage.setItem(
            "accessToken",
            accessToken
        );

        localStorage.setItem(
            "refreshToken",
            refreshToken
        );

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);
    };

    const logout = () => {

        localStorage.removeItem(
            "accessToken"
        );

        localStorage.removeItem(
            "refreshToken"
        );

        localStorage.removeItem(
            "user"
        );

        setUser(null);
    };

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated:
                    !!user,
            }}
        >

            {children}

        </AuthContext.Provider>

    );
};

export default AuthProvider;


