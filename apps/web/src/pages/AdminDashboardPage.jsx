import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  getAdminClaimsApi,
  getAdminDashboardApi,
  getAdminPayoutsApi,
  getAdminWorkersApi,
  processPayoutApi,
  reviewClaimApi,
  updateWorkerVerificationApi
} from '../api/adminApi';

const sectionStyle = {
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '16px',
  marginBottom: '16px',
  backgroundColor: '#fff'
};

const buttonStyle = {
  padding: '8px 12px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#1d4ed8',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '8px',
  marginTop: '6px'
};

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();

  const [metrics, setMetrics] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const [metricsRes, workersRes, claimsRes, payoutsRes] = await Promise.all([
        getAdminDashboardApi(),
        getAdminWorkersApi(),
        getAdminClaimsApi(),
        getAdminPayoutsApi()
      ]);

      setMetrics(metricsRes.data);
      setWorkers(workersRes.data || []);
      setClaims(claimsRes.data || []);
      setPayouts(payoutsRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyWorker = async (workerProfileId) => {
    try {
      setError('');
      setMessage('');
      await updateWorkerVerificationApi(workerProfileId, {
        kycStatus: 'VERIFIED',
        employmentStatus: 'VERIFIED'
      });
      setMessage('Worker verification updated successfully.');
      await loadAdminData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update worker verification');
    }
  };

  const handleApproveClaim = async (claimId) => {
    try {
      setError('');
      setMessage('');
      await reviewClaimApi(claimId, {
        action: 'approve',
        reviewNote: 'Approved from admin dashboard'
      });
      setMessage('Claim approved successfully.');
      await loadAdminData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to approve claim');
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      setError('');
      setMessage('');
      await reviewClaimApi(claimId, {
        action: 'reject',
        reviewNote: 'Rejected from admin dashboard'
      });
      setMessage('Claim rejected successfully.');
      await loadAdminData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reject claim');
    }
  };

  const handleProcessPayout = async (claimId) => {
    try {
      setError('');
      setMessage('');
      await processPayoutApi(claimId);
      setMessage('Payout processed successfully.');
      await loadAdminData();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to process payout');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading admin dashboard...</div>;
  }

  return (
    <div style={{ backgroundColor: '#f5f7fb', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1>Elite Suraksha Admin Dashboard</h1>
            <p>Logged in as {user?.phone}</p>
          </div>
          <button onClick={logout}>Logout</button>
        </div>

        {message ? <div style={{ color: 'green', marginBottom: '16px' }}>{message}</div> : null}
        {error ? <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div> : null}

        <div style={sectionStyle}>
          <h2>Platform Metrics</h2>
          <p><strong>Total Users:</strong> {metrics?.totalUsers ?? 0}</p>
          <p><strong>Total Workers:</strong> {metrics?.totalWorkers ?? 0}</p>
          <p><strong>Total Policies:</strong> {metrics?.totalPolicies ?? 0}</p>
          <p><strong>Active Policies:</strong> {metrics?.activePolicies ?? 0}</p>
          <p><strong>Total Claims:</strong> {metrics?.totalClaims ?? 0}</p>
          <p><strong>Pending Claims:</strong> {metrics?.pendingClaims ?? 0}</p>
          <p><strong>Manual Review Claims:</strong> {metrics?.manualReviewClaims ?? 0}</p>
          <p><strong>Rejected Claims:</strong> {metrics?.rejectedClaims ?? 0}</p>
          <p><strong>Paid Claims:</strong> {metrics?.paidClaims ?? 0}</p>
          <p><strong>Total Payouts:</strong> {metrics?.totalPayouts ?? 0}</p>
          <p><strong>Total Payout Amount:</strong> ₹ {String(metrics?.totalPayoutAmount ?? 0)}</p>
          <p><strong>Total Claim Exposure:</strong> ₹ {String(metrics?.totalClaimExposure ?? 0)}</p>
        </div>

        <div style={sectionStyle}>
          <h2>Workers</h2>
          {workers.length === 0 ? (
            <p>No workers found.</p>
          ) : (
            workers.map((worker) => (
              <div
                key={worker.id}
                style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}
              >
                <p><strong>Name:</strong> {worker.fullName}</p>
                <p><strong>Phone:</strong> {worker.user?.phone}</p>
                <p><strong>City:</strong> {worker.primaryCity}</p>
                <p><strong>Platform:</strong> {worker.workPlatform}</p>
                <p><strong>KYC:</strong> {worker.kycStatus}</p>
                <p><strong>Employment:</strong> {worker.employmentStatus}</p>
                <button style={buttonStyle} onClick={() => handleVerifyWorker(worker.id)}>
                  Mark KYC + Employment Verified
                </button>
              </div>
            ))
          )}
        </div>

        <div style={sectionStyle}>
          <h2>Claims</h2>
          {claims.length === 0 ? (
            <p>No claims found.</p>
          ) : (
            claims.map((claim) => (
              <div
                key={claim.id}
                style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}
              >
                <p><strong>Worker:</strong> {claim.workerProfile?.fullName}</p>
                <p><strong>Phone:</strong> {claim.workerProfile?.user?.phone}</p>
                <p><strong>Trigger:</strong> {claim.triggerEvent?.triggerType}</p>
                <p><strong>Status:</strong> {claim.status}</p>
                <p><strong>Fraud Score:</strong> {String(claim.fraudScore ?? '-')}</p>
                <p><strong>Amount:</strong> ₹ {String(claim.payoutAmount)}</p>
                <p><strong>Reason:</strong> {claim.reason || '-'}</p>

                <button style={buttonStyle} onClick={() => handleApproveClaim(claim.id)}>
                  Approve Claim
                </button>
                <button
                  style={{ ...buttonStyle, backgroundColor: '#b91c1c' }}
                  onClick={() => handleRejectClaim(claim.id)}
                >
                  Reject Claim
                </button>

                {claim.status === 'AUTO_APPROVED' ? (
                  <button
                    style={{ ...buttonStyle, backgroundColor: '#0f766e' }}
                    onClick={() => handleProcessPayout(claim.id)}
                  >
                    Process Payout
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>

        <div style={sectionStyle}>
          <h2>Payouts</h2>
          {payouts.length === 0 ? (
            <p>No payouts found.</p>
          ) : (
            payouts.map((payout) => (
              <div
                key={payout.id}
                style={{ borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}
              >
                <p><strong>Worker:</strong> {payout.workerProfile?.fullName}</p>
                <p><strong>Phone:</strong> {payout.workerProfile?.user?.phone}</p>
                <p><strong>Trigger:</strong> {payout.claim?.triggerEvent?.triggerType}</p>
                <p><strong>Status:</strong> {payout.status}</p>
                <p><strong>Amount:</strong> ₹ {String(payout.amount)}</p>
                <p><strong>Provider Ref:</strong> {payout.providerRef}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;