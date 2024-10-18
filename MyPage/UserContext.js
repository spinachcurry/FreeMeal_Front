// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false); // 토큰이 없는 경우 로딩 종료
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsAuthenticated(true);
      setRoles(response.data.roles || []);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('사용자 정보를 불러오는 중 오류가 발생했습니다.', error);
      handleLogout();
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRoles(userData.roles || []);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setRoles([]);
  };

  return (
    <UserContext.Provider 
      value={{ user, isAuthenticated, roles, handleLogin, handleLogout, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
