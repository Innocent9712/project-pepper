import dotenv, { config } from 'dotenv';
dotenv.config();
import redis, { createClient } from 'redis';
import { promisify } from 'util';
/**
 * basic usage of creating a connection in redis 
 * const redisClient = redis.createClient({url: process.env.REDIS_URL || 'redis://localhost:6379'});
  async ({ async }: { async: boolean }) => await redisClient.connect();
console.log("client connection is successful")
async ({ async }: { async: boolean }) => {
    redisClient.on('error', (err: any) => console.log('Redis Client Error', err));
    await redisClient.connect();
};
*/


class RedisClient {
  redisClient: any;
  
  constructor() {
    const port :number = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
    this.redisClient = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: port
        },
        password: process.env.REDIS_PASSWORD
    });

    this.redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    this.redisClient.on('error', (err:any) => {
      console.error('Error connecting to Redis:', err);
    });
    
  }
  // checks if the connection is alive
  
  async isAlive(): Promise<boolean> {
    const pingAsync = promisify(this.redisClient.ping).bind(this.redisClient);
    try {
      const reply = await pingAsync();
      return reply === 'PONG';
    } catch (err) {
      return false;
    }
  }

  async getRedisValue(key: string): Promise<string> {
    const getAsync = promisify(this.redisClient.get).bind(this.redisClient);
    return getAsync(key);
  }

  async set(key: string, value: string, expireSeconds: number): Promise<void> {
    const setexAsync = promisify(this.redisClient.setex).bind(this.redisClient);
    await setexAsync(key, expireSeconds, value);
  }
  
  async del(key: string): Promise<number> {
    const delAsync = promisify(this.redisClient.del).bind(this.redisClient);
    return delAsync(key);
  }
  

  }
  


// await client.connect();
// check if the connection is working}
// class RedisClient {
//   constructor() {
//     this.client = createClient();
//     // this.client = redis.createClient();

//     this.client.on('error', (err) => console.error('Error occurred while connecting to Redis:', err));
//   }

//   isAlive() {
//     // return this.client && this.client.readyState === "ready";
//     return this.client.connected;
//   }

//   async get(key) {
//     return new Promise((resolve, reject) => {
//       this.client.get(key, (err, value) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(value);
//         }
//       });
//     });
//   }

//   async set(key, value, duration) {
//     return new Promise((resolve, reject) => {
//       this.client.set(key, value, 'EX', duration, (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }

//   async del(key) {
//     return new Promise((resolve, reject) => {
//       this.client.del(key, (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }
// }
const redisClient = new RedisClient();
redisClient.isAlive().then((alive) => {
  console.log(`Redis client is alive: ${alive}`);
});

export { redis, redisClient };

/**function async() {
    throw new Error("Function not implemented.");
}
*/