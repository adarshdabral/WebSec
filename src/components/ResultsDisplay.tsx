import React from 'react';
import { ScanResults } from '../types';

interface ResultsDisplayProps {
  results: ScanResults | { error: string } | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) return null;

  if ('error' in results) {
    return <p className="text-red-500 mt-4">{results.error}</p>;
  }

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-300">Scan Results</h2>
      <ul className="space-y-4">
        {Object.entries(results).map(([vulnerability, details]) => (
          <li key={vulnerability} className="bg-primary shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-300">{vulnerability}</h3>
            <p className={`text-sm ${details.found ? 'text-red-400' : 'text-green-400'}`}>
              {details.found ? 'Vulnerability detected' : 'No vulnerability detected'}
            </p>
            {details.description && (
              <p className="text-sm mt-2 text-gray-400">{details.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultsDisplay;