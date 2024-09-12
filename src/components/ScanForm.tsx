import React, { useState } from 'react';
import axios from 'axios';
import { ScanResults } from '../types';

interface ScanFormProps {
  onScanComplete: (results: ScanResults | { error: string }) => void;
}

const ScanForm: React.FC<ScanFormProps> = ({ onScanComplete }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post<ScanResults>('/api/scan', { url });
      onScanComplete(response.data);
    } catch (error) {
      console.error('Error scanning website:', error);
      onScanComplete({ error: 'An error occurred while scanning the website.' });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
      <div className="flex items-center border-b border-secondary-light py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-300 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="url"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          className="flex-shrink-0 bg-secondary hover:bg-secondary-light border-secondary hover:border-secondary-light text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Scanning...' : 'Scan Website'}
        </button>
      </div>
    </form>
  );
};

export default ScanForm;