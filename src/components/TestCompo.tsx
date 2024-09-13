// import React, { useState } from 'react';

// const TestCompo: React.FC = () => {
//   const [url, setUrl] = useState<string>('');
//   const [response, setResponse] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Handle input change to update the URL
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUrl(e.target.value);
//   };

//   // Function to send a request to the API and fetch the response
//   const fetchApiResponse = async () => {
//     setLoading(true);
//     setError(null);
//     setResponse(null);

//     try {
//       const apiResponse = await fetch(url, {
//         method: 'GET', // You can change the method to POST or others if needed
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!apiResponse.ok) {
//         throw new Error(`Error: ${apiResponse.status} - ${apiResponse.statusText}`);
//       }

//       const result = await apiResponse.json();
//       setResponse(JSON.stringify(result, null, 2)); // Format the JSON response
//     } catch (error) {
//       setError(error instanceof Error ? error.message : 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>TestCompo API Request</h2>
//       <input
//         type="text"
//         placeholder="Enter API URL"
//         value={url}
//         onChange={handleInputChange}
//         className="border rounded p-2 text-black"
//       />
//       <button onClick={fetchApiResponse} className="ml-2 p-2 bg-blue-500 text-white rounded">
//         Fetch Response
//       </button>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">Error: {error}</p>}
//       {response && (
//         <div>
//           <h3>Response:</h3>
//           <pre>{response}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TestCompo;

import React, { useState } from 'react';

const TestCompo: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number | null>(null); // New state for status code

  // Handle input change to update the URL
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  // Function to send a request to the API and fetch the response
  const fetchApiResponse = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatusCode(null); // Reset status code
  
    try {
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      setStatusCode(apiResponse.status);
  
      if (!apiResponse.ok) {
        const errorText = await apiResponse.text(); // Get the error message from the response
        throw new Error(`Error: ${apiResponse.status} - ${apiResponse.statusText} - ${errorText}`);
      }
  
      const contentType = apiResponse.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const result = await apiResponse.json();
        setResponse(JSON.stringify(result, null, 2));
      } else {
        const result = await apiResponse.text(); // Handle non-JSON responses
        setResponse(result);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>TestCompo API Request</h2>
      <input
        type="text"
        placeholder="Enter API URL"
        value={url}
        onChange={handleInputChange}
        className="border rounded p-2 text-black"
      />
      <button onClick={fetchApiResponse} className="ml-2 p-2 bg-blue-500 text-white rounded">
        Fetch Response
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {statusCode !== null && <p>Status Code: {statusCode}</p>} {/* Display status code */}
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default TestCompo;
