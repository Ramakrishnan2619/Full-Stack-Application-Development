import { USERS } from '../data/mockData';

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (role) => {
  await delay();
  const user = role === 'admin' ? USERS.admin : USERS.student;
  localStorage.setItem('scems-user', JSON.stringify(user));
  localStorage.setItem('scems-token', 'mock-jwt-token-' + user.id);
  return user;
};

export const logout = async () => {
  await delay(300);
  localStorage.removeItem('scems-user');
  localStorage.removeItem('scems-token');
  return { success: true };
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('scems-user');
  return stored ? JSON.parse(stored) : null;
};
