import { NextApiRequest, NextApiResponse } from 'next';
import kv from '@/lib/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const lyrics = await kv.hgetall('lyrics') || {};
        const categories = await kv.hgetall('categories') || {};
        
        const lyricsList = Object.entries(lyrics).map(([id, lyric]: [string, any]) => ({
          id,
          ...lyric,
          categoryName: categories[lyric.categoryId] || ''
        }));
        
        res.status(200).json(lyricsList);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching lyrics' });
      }
      break;

    case 'POST':
      try {
        const { title, artist, categoryId, lyrics } = req.body;
        const id = Date.now().toString();
        const lyricData = { title, artist, categoryId, lyrics };
        
        await kv.hset('lyrics', { [id]: lyricData });
        res.status(201).json({ id, ...lyricData });
      } catch (error) {
        res.status(500).json({ error: 'Error creating lyric' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 