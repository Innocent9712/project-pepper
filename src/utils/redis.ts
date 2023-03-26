import { promisify } from 'util';
// import { createClient } from 'redis';
const redis = require('redis')

class RedisClient {
  private client: any;
  private isClientConnected: boolean;

  constructor() {
    this.client = redis.createClient({url: process.env.REDIS_URL || 'redis://localhost:6379'});
    this.isClientConnected = false
    this.client.on('error', (err: Error) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  isAlive(): boolean {
    return this.isClientConnected;
  }

  async get(key: string): Promise<string | null> {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  async set(key: string, value: string | number | boolean, duration: number): Promise<void> {      
    await promisify(this.client.SETEX).bind(this.client)(key, duration, String(value));
  }

  async del(key: string): Promise<void> {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
