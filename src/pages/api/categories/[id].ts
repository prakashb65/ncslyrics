import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@/lib/kv';

type Category = {
  id: string;
  name: string;
};

type SuccessResponse = Category | null;

type ErrorResponse = {
  error: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid input',
      details: 'ID is required and must be a string'
    });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const category = await kv.hget<Category>('categories', id as string);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
        return res.status(200).json(category);
      }

      case 'PUT': {
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ error: 'Name is required' });
        }

        const category: Category = { id: id as string, name };
        await kv.hset('categories', { [id as string]: category });
        return res.status(200).json(category);
      }

      case 'DELETE': {
        await kv.hdel('categories', id as string);
        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Categories API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
} 