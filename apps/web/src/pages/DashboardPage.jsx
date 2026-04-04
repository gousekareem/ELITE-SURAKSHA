import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyWorkerProfileApi } from '../api/workerApi';
import { activatePolicyApi, getMyPolicyApi, getPolicyQuoteApi } from '../api/policyApi';
import { getLatestRiskApi, recalculateRiskApi } from '../api/riskApi';
import { getMyClaimsApi } from '../api/claimApi';
import { getMyPayoutsApi } from '../api/payoutApi';
import { useAuth } from '../auth/AuthContext';

const sectionStyle = {
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
  backgroundColor: '#fff'
};

const buttonStyle = {
  padding: '10px 14px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#1d4ed8',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '10px',
  marginBottom: '10px'
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [quote, setQuote] = useState(null);
  const [risk, setRisk] = useState(null);
  const [claims, setClaims] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        profileResult,
        policyResult,
        quoteResult,
        riskResult,
        claimsResult,
        payoutsResult
      ] = await Promise.all([
        getMyWorkerProfileApi(),
        getMyPolicyApi(),
        getPolicyQuoteApi(),
        getLatestRiskApi(),
        getMyClaimsApi(),
        getMyPayoutsApi()
      ]);

      setProfile(profileResult.data);
      setPolicy(policyResult.data);
      setQuote(quoteResult.data);
      setRisk(riskResult.data);
      setClaims(claimsResult.data || []);
      setPayouts(payoutsResult.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRecalculateRisk = async () => {
    try {
      setMessage('');
      await recalculateRiskApi();
      await loadDashboard();
      setMessage('Risk recalculated successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to recalculate risk');
    }
  };

  const handleActivatePolicy = async () => {
    try {
      setMessage('');
      setError('');
      await activatePolicyApi({});
      await loadDashboard();
      setMessage('Policy activated successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to activate policy');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f5f7fb', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1>Elite Suraksha Dashboard</h1>
            <p>Welcome, {profile?.fullName || user?.phone}</p>
          </div>

          <div>
            <button style={buttonStyle} onClick={() => navigate('/onboarding')}>
              Edit Onboarding
            </button>
            <button style={{ ...buttonStyle, backgroundColor: '#0f766e' }} onClick={handleRecalculateRisk}>
              Recalculate Risk
            </button>
            <button style={{ ...buttonStyle, backgroundColor: '#7c3aed' }} onClick={handleActivatePolicy}>
              Activate Policy
            </button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {message ? <div style={{ color: 'green', marginBottom: '16px' }}>{message}</div> : null}
        {error ? <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div> : null}

        <div style={sectionStyle}>
          <h2>Worker Profile</h2>
          <p><strong>City:</strong> {profile?.primaryCity || '-'}</p>
          <p><strong>Platform:</strong> {profile?.workPlatform || '-'}</p>
          <p><strong>KYC Status:</strong> {profile?.kycStatus || '-'}</p>
          <p><strong>Employment Status:</strong> {profile?.employmentStatus || '-'}</p>
          <p><strong>AutoPay:</strong> {profile?.autopayEnabled ? 'Enabled' : 'Disabled'}</p>
        </div>

        <div style={sectionStyle}>
          <h2>Policy Quote</h2>
          <p><strong>Plan:</strong> {quote?.planName || '-'}</p>
          <p><strong>Weekly Premium:</strong> ₹ {quote?.weeklyPremium || '-'}</p>
          <p><strong>Currency:</strong> {quote?.currency || '-'}</p>
          {quote?.riskSnapshotUsed ? (
            <p><strong>Risk Snapshot Used:</strong> {quote.riskSnapshotUsed.id}</p>
          ) : null}
          <div>
            <strong>Exclusions:</strong>
            <ul>
              {(quote?.exclusions || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2>Active Policy</h2>
          {policy ? (
            <>
              <p><strong>Status:</strong> {policy.status}</p>
              <p><strong>Coverage Start:</strong> {policy.coverageStart}</p>
              <p><strong>Coverage End:</strong> {policy.coverageEnd}</p>
              <p><strong>Weekly Premium:</strong> ₹ {policy.weeklyPremium}</p>
            </>
          ) : (
            <p>No active policy found. Use “Activate Policy” after onboarding and verification start.</p>
          )}
        </div>

        <div style={sectionStyle}>
          <h2>Risk Snapshot</h2>
          {risk ? (
            <>
              <p><strong>Total Risk Score:</strong> {risk.totalRiskScore}</p>
              <p><strong>Weather Risk:</strong> {risk.weatherRiskScore}</p>
              <p><strong>AQI Risk:</strong> {risk.aqiRiskScore}</p>
              <p><strong>Heat Risk:</strong> {risk.heatRiskScore}</p>
              <p><strong>Flood Risk:</strong> {risk.floodRiskScore}</p>
              <p><strong>Recommended Premium:</strong> ₹ {risk.recommendedPremium}</p>
            </>
          ) : (
            <p>No risk snapshot found yet.</p>
          )}
        </div>

        <div style={sectionStyle}>
          <h2>Claims</h2>
          {claims.length === 0 ? (
            <p>No claims found.</p>
          ) : (
            <ul>
              {claims.map((claim) => (
                <li key={claim.id} style={{ marginBottom: '10px' }}>
                  <strong>{claim.triggerEvent?.triggerType}</strong> — Status: {claim.status} — Amount: ₹ {claim.payoutAmount}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={sectionStyle}>
          <h2>Payouts</h2>
          {payouts.length === 0 ? (
            <p>No payouts found.</p>
          ) : (
            <ul>
              {payouts.map((payout) => (
                <li key={payout.id} style={{ marginBottom: '10px' }}>
                  <strong>{payout.claim?.triggerEvent?.triggerType || 'Claim'}</strong> — Status: {payout.status} — Amount: ₹ {payout.amount}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;