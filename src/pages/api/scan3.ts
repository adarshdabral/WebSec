import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      const response = await axios.post(`${BACKEND_URL}/api/scan`, { url });
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error scanning website:', error);
      res.status(500).json({ error: 'An error occurred while scanning the website.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}