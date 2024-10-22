// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react'; 

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
 
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
