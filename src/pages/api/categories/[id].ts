import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@/lib/kv';

type ErrorResponse = {
  error: string;
  details?: any;
};

type SuccessResponse = {
  message?: string;
  id?: string;
  name?: string;
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

  switch (req.method) {
    case 'DELETE':
      try {
        const exists = await kv.hexists('categories', id);
        if (!exists) {
          return res.status(404).json({ 
            error: 'Not found',
            details: 'Category not found'
          });
        }

        await kv.hdel('categories', id);
        return res.status(200).json({ message: 'Category deleted successfully' });
      } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ 
          error: 'Error deleting category',
          details: error instanceof Error ? error.message : String(error)
        });
      }

    case 'PUT':
      try {
        const { name } = req.body;
        if (!name || typeof name !== 'string') {
          return res.status(400).json({ 
            error: 'Invalid input',
            details: 'Category name is required and must be a string'
          });
        }

        await kv.hset('categories', { [id]: name });
        return res.status(200).json({ id, name });
      } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ 
          error: 'Error updating category',
          details: error instanceof Error ? error.message : String(error)
        });
      }

    default:
      res.setHeader('Allow', ['DELETE', 'PUT']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 