// src/infrastructure/database/dbConnection.ts
import { Pool } from 'pg'
import dotenv from 'dotenv'
import logger from '../../config/logger'


dotenv.config()

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
})

pool.on('connect', () => {
  logger.info('PostgreSQL connected successfully')
})

pool.on('error', (err) => {
  logger.error('Unexpected error on PostgreSQL client', err)
  process.exit(1)
})
