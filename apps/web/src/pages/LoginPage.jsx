import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const boxStyle = {
  maxWidth: '420px',
  margin: '50px auto',
  padding: '24px',
  border: '1px solid #ddd',
  borderRadius: '12px',
  backgroundColor: '#fff'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#1d4ed8',
  color: '#fff',
  cursor: 'pointer',
  marginBottom: '10px'
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async () => {
    try {
      setSubmitting(true);
      setError('');
      setMessage('');

      const result = await sendOtp(phone);
      setOtpRequested(true);
      setDevOtp(result?.data?.devOtp || '');
      setMessage('OTP sent successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setSubmitting(true);
      setError('');
      setMessage('');

      const result = await verifyOtp(phone, otp);
      const role = result?.data?.user?.role;

      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#f5f7fb', minHeight: '100vh', padding: '20px' }}>
      <div style={boxStyle}>
        <h1>Elite Suraksha</h1>
        <p>Login for Worker / Admin</p>

        <input
          style={inputStyle}
          type="text"
          placeholder="Enter 10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {!otpRequested ? (
          <button style={buttonStyle} onClick={handleSendOtp} disabled={submitting}>
            {submitting ? 'Sending OTP...' : 'Send OTP'}
          </button>
        ) : (
          <>
            <input
              style={inputStyle}
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button style={buttonStyle} onClick={handleVerifyOtp} disabled={submitting}>
              {submitting ? 'Verifying...' : 'Verify OTP'}
            </button>

            {devOtp ? (
              <div style={{ marginBottom: '10px', fontSize: '14px', color: '#0f766e' }}>
                Dev OTP: <strong>{devOtp}</strong>
              </div>
            ) : null}
          </>
        )}

        {message ? <div style={{ color: 'green', marginTop: '10px' }}>{message}</div> : null}
        {error ? <div style={{ color: 'red', marginTop: '10px' }}>{error}</div> : null}
      </div>
    </div>
  );
};

export default LoginPage;