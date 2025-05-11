const { redisClient } = require('../config/redis');
const logger = require('../utils/logger');

const setCache = async (key, value, expiration = 3600) => {
  try {
    console.log(`Setting cache for key: ${key} with expiration: ${expiration}`);
    console.log(`Value: ${JSON.stringify(value)}`);
    await redisClient.setEx(key, expiration, JSON.stringify(value));
  } catch (error) {
    logger.error('Error setting cache:', error);
  }
};

const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Error getting cache:', error);
    return null;
  }
};

const invalidateCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error('Error invalidating cache:', error);
  }
};

module.exports = {
  setCache,
  getCache,
  invalidateCache,
};