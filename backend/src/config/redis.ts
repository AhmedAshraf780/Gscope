import { createClient } from 'redis';
// import config from './config';

export let redisClient: any;
export async function connectRedis() {
  const client = createClient({
    username: 'default',
    password: 'aQ4BwKirLdJKJ9UzTvKVxiP9Y1qG16Dv',
    socket: {
      host: 'redis-12643.crce177.me-south-1-1.ec2.cloud.redislabs.com',
      port: 12643
    }
  });

  client.on('error', err => console.log('Redis Client Error', err));

  await client.connect();

  await client.set('foo', 'bar');
  const result = await client.get('foo');
  console.log(result)  // >>> bar


  // redisClient = createClient({
  //   username: config.redis_username,
  //   password: config.redis_password,
  //   socket: {
  //     host: config.redis_host,
  //     port: config.redis_port
  //   }
  // });
  //
  // redisClient.on('error', (err: Error) => console.log('Redis Client Error', err));
  //
  // await redisClient.connect();
  //
  // await redisClient.set('foo', 'bar');
  // const result = await redisClient.get('foo');
  // console.log(result)  // >>> bar
}




export async function disconnectRedis() {
  await redisClient.quit();
}

