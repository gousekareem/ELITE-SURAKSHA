import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMeApi, sendOtpApi, verifyOtpApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const result = await getMeApi();
      setUser(result.data);
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const sendOtp = async (phone) => {
    return sendOtpApi(phone);
  };

  const verifyOtp = async (phone, otp) => {
    const result = await verifyOtpApi(phone, otp);

    localStorage.setItem('accessToken', result.data.accessToken);
    localStorage.setItem('refreshToken', result.data.refreshToken);
    setUser(result.data.user);

    return result;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      sendOtp,
      verifyOtp,
      logout,
      reloadUser: loadCurrentUser
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);