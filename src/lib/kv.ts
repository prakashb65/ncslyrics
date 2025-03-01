import { kv } from '@vercel/kv';

// Verify required environment variables
if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error('Vercel KV environment variables are not properly configured');
}

export { kv };
