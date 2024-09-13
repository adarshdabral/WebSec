import { NextApiRequest, NextApiResponse } from 'next';
import { ScanResults } from '../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ScanResults>) {
  if (req.method === 'POST') {
    const { url } = req.body;

    // Simulate a delay to mimic scanning process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock results
    const results: ScanResults = {
      'SQL Injection': {
        found: Math.random() < 0.3,
        description: 'Potential SQL injection vulnerability detected in form inputs.',
      },
      'Cross-Site Scripting (XSS)': {
        found: Math.random() < 0.4,
        description: 'Possible XSS vulnerability found in user input fields.',
      },
      'Weak Passwords': {
        found: Math.random() < 0.5,
        description: 'Weak password policies detected. Consider implementing stronger requirements.',
      },
    };

    res.status(200).json(results);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

