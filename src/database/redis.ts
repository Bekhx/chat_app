import { createClient } from '@redis/client';

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect();

export { redisClient };