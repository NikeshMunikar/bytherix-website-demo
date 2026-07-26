import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV:           'test',
      MONGODB_URI:        'mongodb://localhost:27017/bytherix_test',
      REDIS_URL:          'redis://localhost:6379',
      JWT_ACCESS_SECRET:  'test-access-secret-min-32-characters-long',
      JWT_REFRESH_SECRET: 'test-refresh-secret-min-32-characters-long',
      COOKIE_SECRET:      'test-cookie-secret-min-32-characters!!',
    },
  },
})
