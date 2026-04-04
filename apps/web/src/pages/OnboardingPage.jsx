import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyWorkerProfileApi, saveWorkerProfileApi, startVerificationApi } from '../api/workerApi';
import { getWorkerDocumentsApi, uploadWorkerDocumentApi } from '../api/documentApi';
import { useAuth } from '../auth/AuthContext';

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '12px',
  borderRadius: '8px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '12px 16px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#1d4ed8',
  color: '#fff',
  cursor: 'pointer',
  marginRight: '10px',
  marginBottom: '10px'
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '12px',
  padding: '16px',
  marginTop: '20px',
  backgroundColor: '#fff'
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    primaryCity: '',
    homeLatitude: '',
    homeLongitude: '',
    workPlatform: '',
    aadhaarHash: '',
    autopayEnabled: false
  });

  const [documents, setDocuments] = useState([]);
  const [uploadType, setUploadType] = useState('KYC_ID');
  const [uploadFile, setUploadFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    try {
      const [profileRes, docsRes] = await Promise.all([
        getMyWorkerProfileApi(),
        getWorkerDocumentsApi()
      ]);

      const profile = profileRes.data;
      if (profile) {
        setForm({
          fullName: profile.fullName || '',
          dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : '',
          primaryCity: profile.primaryCity || '',
          homeLatitude: profile.homeLatitude || '',
          homeLongitude: profile.homeLongitude || '',
          workPlatform: profile.workPlatform || '',
          aadhaarHash: profile.aadhaarHash || '',
          autopayEnabled: Boolean(profile.autopayEnabled)
        });
      }

      setDocuments(docsRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load onboarding data');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setMessage('');
      await saveWorkerProfileApi(form);
      setMessage('Worker profile saved successfully.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save worker profile');
    } finally {
      setSaving(false);
    }
  };

  const handleStartVerification = async () => {
    try {
      setSaving(true);
      setError('');
      setMessage('');
      await startVerificationApi({
        kycRequested: true,
        employmentRequested: true
      });
      setMessage('Verification started successfully.');
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to start verification');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocument = async () => {
    try {
      if (!uploadFile) {
        setError('Please choose a file to upload.');
        return;
      }

      setSaving(true);
      setError('');
      setMessage('');
      await uploadWorkerDocumentApi(uploadType, uploadFile);
      setMessage('Document uploaded successfully.');
      setUploadFile(null);
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to upload document');
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return <div style={{ padding: '2rem' }}>Loading onboarding...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Worker Onboarding</h1>
        <div>
          <span style={{ marginRight: '15px' }}>{user?.phone}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <input style={inputStyle} name="fullName" placeholder="Full name" value={form.fullName} onChange={handleChange} />
      <input style={inputStyle} name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
      <input style={inputStyle} name="primaryCity" placeholder="Primary city" value={form.primaryCity} onChange={handleChange} />
      <input style={inputStyle} name="homeLatitude" placeholder="Home latitude" value={form.homeLatitude} onChange={handleChange} />
      <input style={inputStyle} name="homeLongitude" placeholder="Home longitude" value={form.homeLongitude} onChange={handleChange} />
      <input style={inputStyle} name="workPlatform" placeholder="Work platform (Swiggy / Zomato)" value={form.workPlatform} onChange={handleChange} />
      <input style={inputStyle} name="aadhaarHash" placeholder="Aadhaar hash" value={form.aadhaarHash} onChange={handleChange} />

      <label style={{ display: 'block', marginBottom: '16px' }}>
        <input
          type="checkbox"
          name="autopayEnabled"
          checked={form.autopayEnabled}
          onChange={handleChange}
        />{' '}
        Enable AutoPay
      </label>

      <div style={{ marginTop: '10px' }}>
        <button style={buttonStyle} onClick={handleSaveProfile} disabled={saving}>
          Save Profile
        </button>

        <button style={buttonStyle} onClick={handleStartVerification} disabled={saving}>
          Start Verification
        </button>

        <button
          style={{ ...buttonStyle, backgroundColor: '#0f766e' }}
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>

      <div style={cardStyle}>
        <h2>Upload Documents</h2>

        <select
          style={inputStyle}
          value={uploadType}
          onChange={(e) => setUploadType(e.target.value)}
        >
          <option value="KYC_ID">KYC ID</option>
          <option value="EMPLOYMENT_SCREENSHOT">Employment Screenshot</option>
          <option value="BANK_PROOF">Bank Proof</option>
          <option value="PROFILE_PHOTO">Profile Photo</option>
        </select>

        <input
          style={inputStyle}
          type="file"
          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
        />

        <button style={buttonStyle} onClick={handleUploadDocument} disabled={saving}>
          Upload Document
        </button>

        <div style={{ marginTop: '16px' }}>
          <strong>Uploaded Documents</strong>
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                {doc.type} — {doc.reviewStatus} — {doc.fileUrl}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {message ? <div style={{ color: 'green', marginTop: '16px' }}>{message}</div> : null}
      {error ? <div style={{ color: 'red', marginTop: '16px' }}>{error}</div> : null}
    </div>
  );
};

export default OnboardingPage;