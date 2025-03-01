import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@/lib/kv';

type ErrorResponse = {
  error: string;
  details?: any;
};

type SuccessResponse = {
  id?: string;
  name?: string;
  categories?: Array<{ id: string; name: string }>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  try {
    switch (req.method) {
      case 'GET':
        try {
          const categories = await kv.hgetall('categories') || {};
          const categoriesList = Object.entries(categories).map(([id, name]) => ({
            id,
            name: String(name),
          }));
          return res.status(200).json(categoriesList);
        } catch (error) {
          console.error('Error fetching categories:', error);
          return res.status(500).json({ 
            error: 'Failed to fetch categories',
            details: error instanceof Error ? error.message : String(error)
          });
        }

      case 'POST':
        try {
          const { name } = req.body;
          
          if (!name || typeof name !== 'string') {
            return res.status(400).json({ 
              error: 'Invalid input',
              details: 'Category name is required and must be a string'
            });
          }

          const id = Date.now().toString();
          await kv.hset('categories', { [id]: name });
          return res.status(201).json({ id, name });
        } catch (error) {
          console.error('Error creating category:', error);
          return res.status(500).json({ 
            error: 'Failed to create category',
            details: error instanceof Error ? error.message : String(error)
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 