import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@/lib/kv';

type ErrorResponse = {
  error: string;
  details?: any;
};

interface Lyric {
  id: string;
  title: string;
  artist: string;
  category?: string;
  lyrics: string;
}

type SuccessResponse = {
  id?: string;
  title?: string;
  artist?: string;
  category?: string;
  lyrics?: string;
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
      case 'GET':
        try {
          const exists = await kv.hexists('lyrics', id);
          if (!exists) {
            return res.status(404).json({ 
              error: 'Not found',
              details: 'Lyric not found'
            });
          }

          const lyricData = await kv.hget('lyrics', id);
          if (!lyricData) {
            return res.status(404).json({ 
              error: 'Not found',
              details: 'Lyric data is empty'
            });
          }

          const parsedData = typeof lyricData === 'string' ? JSON.parse(lyricData) : lyricData;
          return res.status(200).json({ id, ...parsedData });
        } catch (error) {
          console.error('Error fetching lyric:', error);
          return res.status(500).json({ 
            error: 'Failed to fetch lyric',
            details: error instanceof Error ? error.message : String(error)
          });
        }

      case 'PUT':
        try {
          const { title, artist, category, lyrics } = req.body;
          
          if (!title || typeof title !== 'string') {
            return res.status(400).json({ 
              error: 'Invalid input',
              details: 'Title is required and must be a string'
            });
          }

          if (!artist || typeof artist !== 'string') {
            return res.status(400).json({ 
              error: 'Invalid input',
              details: 'Artist is required and must be a string'
            });
          }

          if (!lyrics || typeof lyrics !== 'string') {
            return res.status(400).json({ 
              error: 'Invalid input',
              details: 'Lyrics are required and must be a string'
            });
          }

          const lyricData = {
            title,
            artist,
            ...(category && { category }),
            lyrics,
          };

          await kv.hset('lyrics', { [id]: JSON.stringify(lyricData) });
          return res.status(200).json({ id, ...lyricData });
        } catch (error) {
          console.error('Error updating lyric:', error);
          return res.status(500).json({ 
            error: 'Failed to update lyric',
            details: error instanceof Error ? error.message : String(error)
          });
        }

      case 'DELETE':
        try {
          const exists = await kv.hexists('lyrics', id);
          if (!exists) {
            return res.status(404).json({ 
              error: 'Not found',
              details: 'Lyric not found'
            });
          }

          await kv.hdel('lyrics', id);
          return res.status(204).end();
        } catch (error) {
          console.error('Error deleting lyric:', error);
          return res.status(500).json({ 
            error: 'Failed to delete lyric',
            details: error instanceof Error ? error.message : String(error)
          });
        }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
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