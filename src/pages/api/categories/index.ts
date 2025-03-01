import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@/lib/kv';
import { nanoid } from 'nanoid';

type Category = {
  id: string;
  name: string;
};

type SuccessResponse = {
  categories?: Category[];
} | Category;

type ErrorResponse = {
  error: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  try {
    switch (req.method) {
      case 'GET': {
        const categories = await kv.hgetall<Record<string, Category>>('categories');
        const categoriesList = categories ? Object.values(categories) : [];
        return res.status(200).json({ categories: categoriesList });
      }

      case 'POST': {
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ 
            error: 'Invalid input',
            details: 'Name is required'
          });
        }

        const id = nanoid();
        const category: Category = { id, name };
        await kv.hset('categories', { [id]: category });
        return res.status(201).json(category);
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ 
          error: `Method ${req.method} Not Allowed`,
          details: 'This endpoint only supports GET and POST methods'
        });
    }
  } catch (error) {
    console.error('Categories API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
} 