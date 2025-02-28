import { NextApiRequest, NextApiResponse } from 'next';
import kv from '@/lib/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'DELETE':
      try {
        await kv.hdel('categories', id as string);
        res.status(200).json({ message: 'Category deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Error deleting category' });
      }
      break;

    case 'PUT':
      try {
        const { name } = req.body;
        await kv.hset('categories', { [id as string]: name });
        res.status(200).json({ id, name });
      } catch (error) {
        res.status(500).json({ error: 'Error updating category' });
      }
      break;

    default:
      res.setHeader('Allow', ['DELETE', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 