import { NextApiRequest, NextApiResponse } from 'next';
import kv from '@/lib/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const categories = await kv.hgetall('categories') || {};
        const categoriesList = Object.entries(categories).map(([id, name]) => ({
          id,
          name,
        }));
        res.status(200).json(categoriesList);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching categories' });
      }
      break;

    case 'POST':
      try {
        const { name } = req.body;
        const id = Date.now().toString();
        await kv.hset('categories', { [id]: name });
        res.status(201).json({ id, name });
      } catch (error) {
        res.status(500).json({ error: 'Error creating category' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 