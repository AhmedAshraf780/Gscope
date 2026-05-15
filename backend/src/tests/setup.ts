import { beforeAll, afterAll } from '@jest/globals';

jest.mock('uuid', () => ({
  v4: () => '12345678-1234-1234-1234-1234567890ab'
}));

jest.mock('../config/redis', () => ({
  redisClient: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    quit: jest.fn().mockResolvedValue('OK'),
  },
  connectRedis: jest.fn(),
}));

process.env.NODE_ENV = "test";

beforeAll(async () => {
  // Mock implementations if needed
});

afterAll(async () => {
  // Cleanup
});
