import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Redis client object class
 */
class RedisClient {
  /**
   * constructor, initiates a new redis client instance.
   */
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
   * that returns true when the connection to Redis is a success otherwise, false
   * @returns {boolean}
   */
  isAlive() {
    return this.isClientConnected;
  }

  /**
   * retrieves the Redis value stored for this key
   * @param {String} key of the item to retrieve
   * @return {String | Object}
   */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
   * Stores a key and it's value along with an expiration time.
   * @param {String} key key of item
   * @param {String | Number | Boolean} value item to store
   * @param {Number} duration time before expiring
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  /**
   * Removes the value stored with the key
   * @param {String} key the key of the value to remove
   * @returns {Promise<void>}
   */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
