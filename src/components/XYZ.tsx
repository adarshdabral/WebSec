import React, { useState } from 'react';

const XYZ: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const fetchApiResponse = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      setResponse(JSON.stringify(result, null, 2)); // Formatting the response
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>API Request Component</h2>
      <input
        type="text"
        placeholder="Enter API URL"
        value={url}
        onChange={handleInputChange}
        className="border rounded p-2"
      />
      <button onClick={fetchApiResponse} className="ml-2 p-2 bg-blue-500 text-white rounded">
        Fetch Response
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default XYZ;
