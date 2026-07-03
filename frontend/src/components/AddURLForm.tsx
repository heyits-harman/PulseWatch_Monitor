import React, { useState } from 'react';
import axios from 'axios';

const AddURLForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {

  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.SubmitEvent): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try{
      const response = await axios.post('http://localhost:5000/api/urls', {url} );

      setUrl("");

      setSuccess("URL added successfully!")

      if (onSuccess) onSuccess();

    } catch(err: any){
      setError(err.response?.data?.message || "Failed to add URL");
    }
  }

  return(
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={ (e) => setUrl(e.target.value) }
        placeholder="Enter URL"
        required
      />
      <button type="submit">Add URL</button>

      {success && <p style={ {color: "green"} }>{success}</p>}
    </form>
  );
}
export default AddURLForm;