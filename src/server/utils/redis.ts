import IORedis from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }
  return "redis://localhost:6381/0";
};

export const redisConnection = new IORedis(getRedisUrl(), {
  maxRetriesPerRequest: null,
});

export const redis = new IORedis(getRedisUrl());
