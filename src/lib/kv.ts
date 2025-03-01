import { Redis } from '@upstash/redis';
import { kv } from '@vercel/kv';

if (!process.env.KV_REST_API_URL) {
  throw new Error('KV_REST_API_URL is not defined');
}

if (!process.env.KV_REST_API_TOKEN) {
  throw new Error('KV_REST_API_TOKEN is not defined');
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  automaticDeserialization: true,
});

export { redis as kv };
// Export the kv instance as both default and named export
export default redis; 