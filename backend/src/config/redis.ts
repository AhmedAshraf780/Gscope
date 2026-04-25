import { createClient } from 'redis';
import config from './config';

export let redisClient: any;
export async function connectRedis() {
  redisClient = createClient({
    username: config.redis_username,
    password: config.redis_password,
    socket: {
      host: config.redis_host,
      port: config.redis_port
    }
  });

  redisClient.on('error', err => console.log('Redis Client Error', err));

  await redisClient.connect();

  await redisClient.set('foo', 'bar');
  const result = await redisClient.get('foo');
  console.log(result)  // >>> bar
}

export async function disconnectRedis() {
  await redisClient.quit();
}

