import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Load user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Login failed');

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Registration failed');

            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
