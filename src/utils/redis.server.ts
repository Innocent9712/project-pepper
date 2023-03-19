/**
 * glossary:
 * ACL: access control user. i.e a verified user
 */
import dotenv, { config } from 'dotenv';
dotenv.config();
import redis, {createClient, RedisClientType} from 'redis';

console.log(process.env.REDIS_HOST);
console.log(process.env.REDIS_PORT);

const port =process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: port
  },
  password: process.env.REDIS_PASSWORD
});

redisClient.on('error', (err: any) => {
  console.error('error connecting to redis server', err);
})

redisClient.on('connect', () => {
  console.log('connection was successful');
})

//redisClient.set('key', 'value');
const setKey = redisClient.set('key','value');
redisClient.get('key');

redisClient.del('key');

// how to check if the key was set successfully
const checkset = (redisClient:any, key:string, value:string) => {
  return new Promise((resolve, reject) => {
    redisClient(setKey,(err: any, reply: string) => {
      if (err) {
        reject(err);
      } else if (reply === "OK") {
        resolve(console.log(reply));
      } else {
        reject(new Error("Unexpected Redis reply"));
      }
    });
  });
}

setKey("chizoba", "name")