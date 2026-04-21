import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Shield, ArrowLeft, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { loginAsStudent, loginAsAdmin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/events', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleStudentLogin = () => {
    loginAsStudent();
    toast.success('Welcome back, Arjun! 👋');
    navigate('/events');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError('');
    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAdminError('Please enter both username and password');
      return;
    }
    try {
      loginAsAdmin(adminUsername, adminPassword);
      toast.success('Welcome, Rama! 🔐');
      navigate('/admin');
    } catch {
      setAdminError('Invalid username or password');
      toast.error('Login failed — check credentials');
    }
  };

  if (isAuthenticated) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: 'var(--accent)', top: '20%', right: '20%' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div
          className="glass rounded-2xl p-8 sm:p-10"
          style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
              whileHover={{ rotate: 10 }}
            >
              <span className="text-3xl font-clash font-bold" style={{ color: 'var(--accent)' }}>
                S
              </span>
            </motion.div>
            <h1 className="font-clash font-bold text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
              SCEMS
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Smart Campus Event Management System
            </p>
          </div>

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            {['student', 'admin'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setAdminError(''); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer border-none capitalize"
                style={{
                  backgroundColor: activeTab === tab ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : 'var(--text-muted)',
                }}
              >
                {tab === 'student' ? <GraduationCap size={18} /> : <Shield size={18} />}
                {tab}
              </button>
            ))}
          </div>

          {/* Student Login */}
          {activeTab === 'student' && (
            <motion.div
              key="student"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div
                className="rounded-xl p-4 mb-5 text-sm"
                style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)', color: 'var(--text-muted)' }}
              >
                <p className="font-medium mb-1" style={{ color: 'var(--accent)' }}>Demo Student Account</p>
                <p>Name: <strong>Arjun Kumar</strong></p>
                <p>Roll: <strong>21CS045</strong> · CSE · Year 3</p>
              </div>
              <motion.button
                onClick={handleStudentLogin}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer border-none"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <GraduationCap size={22} />
                Login as Student
              </motion.button>
            </motion.div>
          )}

          {/* Admin Login */}
          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <form onSubmit={handleAdminLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Username
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Enter admin username"
                      value={adminUsername}
                      onChange={(e) => { setAdminUsername(e.target.value); setAdminError(''); }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: adminError ? '2px solid var(--accent-danger)' : '1px solid var(--border)',
                      }}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
                      className="w-full pl-10 pr-12 py-3 rounded-xl text-sm"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        border: adminError ? '2px solid var(--accent-danger)' : '1px solid var(--border)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {adminError && (
                  <p className="text-xs font-medium mb-4" style={{ color: 'var(--accent-danger)' }}>
                    ⚠️ {adminError}
                  </p>
                )}

                <motion.button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer border-none"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: '#ffffff',
                  }}
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shield size={22} />
                  Login as Admin
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Back link */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 text-sm font-medium transition-colors hover:opacity-80 no-underline"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
