import React, { createContext, useState, useContext, useEffect } from "react";
import publicAxios from "../api/publicAxios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const saveToken = token => {
        localStorage.setItem("token", JSON.stringify(token));
    };

    const removeToken = () => {
        localStorage.removeItem("token");
    };

    const register = async (fullName, email, password, getUserData) => {
        try {
            const response = await publicAxios.post(
                "/auth/register",
                JSON.stringify({
                    user_full_name: fullName,
                    user_email: email,
                    user_password: password,
                    user_avatar_url: "",
                    checkMessage: "Register new account"
                })
            );

            if (!response.ok) {
                throw new Error("Registration failed!");
            }

            const data = await response.json();
            console.log(data);

            // Cập nhật token và trạng thái xác thực
            setToken(data.token);
            setIsAuthenticated(true);
            localStorage.setItem("token", data.token);

            // Gọi API để lấy dữ liệu người dùng từ UserContext
            await getUserData(data.token);
            
            console.log("Registration successful!");
        } catch (error) {
            console.error("Registration error:", error.message);
        }
    };

    const login = token => {
        setToken(token);
        setIsAuthenticated(true);
        saveToken(token);
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        removeToken();
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(JSON.parse(storedToken));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, token, loading, login, logout, register }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
