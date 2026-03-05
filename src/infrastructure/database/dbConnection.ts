import { Pool } from 'pg'
import dotenv from 'dotenv'
import logger from '../../config/logger'

dotenv.config()

const pools: Record<number, Pool> = {
  0: new Pool({
    connectionString: process.env.DATABASE_URL_FERNANDO,
    ssl: { rejectUnauthorized: false },
  }),
  1: new Pool({
    connectionString: process.env.DATABASE_URL_ASUNCION,
    ssl: { rejectUnauthorized: false },
  }),
}

// Logs
Object.values(pools).forEach((pool, index) => {
  pool.on('connect', () => {
    logger.info(`PostgreSQL connected successfully (type ${index})`)
  })

  pool.on('error', (err) => {
    logger.error(`Unexpected PostgreSQL error (type ${index})`, err)
  })
})

export const getPoolByType = (type: number): Pool => {
  const pool = pools[type]
  if (!pool) {
    throw new Error('La base de datos que intentas conectarte no es accesible')
  }
  return pool
}