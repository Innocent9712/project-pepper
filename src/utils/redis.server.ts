import { createClient } from 'redis';

const client = createClient({url: process.env.REDIS_URL || 'redis://localhost:6379'})
client.on('error', err => console.log('Redis Client Error', err));
// await client.connect();


class RedisClient {
    async isAlive() {
        await client.connect()
        console.log(client)
        return client.isReady
    }
}
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
console.log(redisClient.isAlive())
export default redisClient;