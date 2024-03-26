import redis from 'redis';
import dotenv from 'dotenv';

const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379
});

// await redisClient.connect();

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => { 
  console.error('Redis connection error', err);
});

redisClient.on('ready', () => {
  console.log('Redis is ready');
});

redisClient.on('end', () => {
  console.log('Redis connection ended');
});

process.on('SIGINT', () => {
  client.quit();
});

export default redisClient;