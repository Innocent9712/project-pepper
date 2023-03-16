const redis = require('redis');
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
    this.redisClient = redis.createClient({
        host: 'localhost',
        port: 6379
    });

    this.redisClient.on('connect', () => {
      console.log('Redis client connected');
    });

    this.redisClient.on('error', (err:any) => {
      console.error('Error connecting to Redis:', err);
    });
    
  }
  // checks if the connection is alive
  isAlive(): boolean {
    return this.redisClient.connected;
  };

  async getRedisValue(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.redisClient.get(key, (err:any, reply:any) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async set(key: string, value: string, expireSeconds: number): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.redisClient.setex(key, expireSeconds, value, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  
  async del(key: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.redisClient.del(key, (err: Error | null, reply: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
  

  };
  


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
console.log(`${redisClient.isAlive()}`)
export { redis, redisClient };

function async() {
    throw new Error("Function not implemented.");
}
