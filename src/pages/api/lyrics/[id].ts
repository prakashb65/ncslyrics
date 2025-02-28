import { NextApiRequest, NextApiResponse } from 'next';
import kv from '@/lib/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  switch (req.method) {
    case 'DELETE':
      try {
        await kv.hdel('lyrics', id as string);
        res.status(200).json({ message: 'Lyric deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Error deleting lyric' });
      }
      break;

    case 'PUT':
      try {
        const { title, artist, categoryId, lyrics } = req.body;
        const lyricData = { title, artist, categoryId, lyrics };
        await kv.hset('lyrics', { [id as string]: lyricData });
        res.status(200).json({ id, ...lyricData });
      } catch (error) {
        res.status(500).json({ error: 'Error updating lyric' });
      }
      break;

    default:
      res.setHeader('Allow', ['DELETE', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 