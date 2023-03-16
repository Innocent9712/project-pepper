import { redisClient } from './src/utils/redis.server';


(async () => {
  console.log(redisClient.isAlive());
  console.log(await redisClient.getRedisValue('myKey'));
  await redisClient.set('myKey', '12', 5);
  console.log(await redisClient.getRedisValue('myKey'));

  setTimeout(async () => {
    console.log(await redisClient.getRedisValue('myKey'));
  }, 1000*10)
})();
