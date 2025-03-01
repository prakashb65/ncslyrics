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
  items?: Lyric[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  try {
    switch (req.method) {
      case 'GET':
        try {
          const lyrics = await kv.hgetall('lyrics') || {};
          const lyricsList = Object.entries(lyrics).map(([id, data]) => ({
            id,
            ...(typeof data === 'string' ? JSON.parse(data) : data),
          }));
          return res.status(200).json({ items: lyricsList });
        } catch (error) {
          console.error('Error fetching lyrics:', error);
          return res.status(500).json({ 
            error: 'Failed to fetch lyrics',
            details: error instanceof Error ? error.message : String(error)
          });
        }

      case 'POST':
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

          const id = Date.now().toString();
          const lyricData = {
            title,
            artist,
            ...(category && { category }),
            lyrics,
          };

          await kv.hset('lyrics', { [id]: JSON.stringify(lyricData) });
          return res.status(201).json({ id, ...lyricData });
        } catch (error) {
          console.error('Error creating lyric:', error);
          return res.status(500).json({ 
            error: 'Failed to create lyric',
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