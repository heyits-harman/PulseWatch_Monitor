import React, { useState } from 'react';
import axios from 'axios';

const AddURLForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/urls`, { url });
      setUrl('');
      setSuccess('Endpoint added — health checks will begin shortly.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to add URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding…' : '+ Add Monitor'}
        </button>
      </form>

      {success && <p className="form-message success">{success}</p>}
      {error && <p className="form-message error">{error}</p>}
    </>
  );
};

export default AddURLForm;
