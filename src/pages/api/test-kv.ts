import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@/lib/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test 1: Writing to KV
    const testData = {
      message: 'Hello from NCSLyrics!',
      timestamp: new Date().toISOString()
    };
    await kv.set('test-key', testData);
    
    // Test 2: Reading from KV
    const readValue = await kv.get('test-key');
    
    // Test 3: Testing expiration (set for 60 seconds)
    await kv.set('test-expiry-key', 'This will expire in 60 seconds', { ex: 60 });
    const expiryValue = await kv.get('test-expiry-key');
    
    // Test 4: Testing hash operations
    await kv.hset('test-hash', {
      name: 'NCS Lyrics',
      version: '1.0',
      status: 'testing'
    });
    const hashValue = await kv.hgetall('test-hash');
    
    res.status(200).json({ 
      success: true, 
      message: 'All KV connection tests successful',
      tests: {
        basicTest: {
          written: testData,
          read: readValue
        },
        expiryTest: {
          value: expiryValue,
          ttl: await kv.ttl('test-expiry-key')
        },
        hashTest: hashValue
      }
    });
  } catch (error) {
    console.error('KV test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'KV connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 