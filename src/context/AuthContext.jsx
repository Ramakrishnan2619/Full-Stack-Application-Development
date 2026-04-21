import { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'Rama',
  password: 'vtu24465',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('scems-user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('scems-user');
      }
    }
    setLoading(false);
  }, []);

  const loginAsStudent = () => {
    const student = USERS.student;
    setUser(student);
    localStorage.setItem('scems-user', JSON.stringify(student));
    localStorage.setItem('scems-token', 'mock-jwt-token-S001');
    return student;
  };

  const loginAsAdmin = (username, password) => {
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      throw new Error('Invalid admin credentials');
    }
    const admin = USERS.admin;
    setUser(admin);
    localStorage.setItem('scems-user', JSON.stringify(admin));
    localStorage.setItem('scems-token', 'mock-jwt-token-A001');
    return admin;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scems-user');
    localStorage.removeItem('scems-token');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loginAsStudent, loginAsAdmin, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
