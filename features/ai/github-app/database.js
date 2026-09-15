/**
 * Database Configuration and Connection Setup
 * Supports PostgreSQL, MySQL, MongoDB, and SQLite
 */

const fs = require('fs');
const path = require('path');

const dbType = process.env.DB_TYPE || 'postgresql';
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'job_board_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  poolMin: parseInt(process.env.DB_POOL_MIN) || 5,
  poolMax: parseInt(process.env.DB_POOL_MAX) || 20,
  debug: process.env.DB_DEBUG === 'true',
};

let db = null;

/**
 * Initialize database connection based on DB_TYPE
 */
async function initializeDatabase() {
  try {
    console.log(`Initializing ${dbType} database connection...`);
    
    switch (dbType) {
      case 'postgresql':
        db = await initPostgreSQL();
        break;
      case 'mysql':
        db = await initMySQL();
        break;
      case 'mongodb':
        db = await initMongoDB();
        break;
      case 'sqlite':
        db = initSQLite();
        break;
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
    
    console.log(`Successfully connected to ${dbType} database`);
    return db;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    throw error;
  }
}

/**
 * PostgreSQL initialization
 */
async function initPostgreSQL() {
  const { Pool } = require('pg');
  const pool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
    max: dbConfig.poolMax,
    min: dbConfig.poolMin,
  });
  
  // Test connection
  await pool.query('SELECT NOW()');
  return pool;
}

/**
 * MySQL initialization
 */
async function initMySQL() {
  const mysql = require('mysql2/promise');
  const pool = await mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
    waitForConnections: true,
    connectionLimit: dbConfig.poolMax,
  });
  
  return pool;
}

/**
 * MongoDB initialization
 */
async function initMongoDB() {
  const { MongoClient } = require('mongodb');
  const url = `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
  const client = new MongoClient(url);
  
  await client.connect();
  return client.db(dbConfig.database);
}

/**
 * SQLite initialization
 */
function initSQLite() {
  const Database = require('better-sqlite3');
  const dbPath = process.env.SQLITE_PATH || './data/job_board.db';
  
  // Ensure directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  return new Database(dbPath);
}

/**
 * Get database connection
 */
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
async function closeDatabase() {
  if (db) {
    if (dbType === 'postgresql' || dbType === 'mysql') {
      await db.end();
    } else if (dbType === 'mongodb') {
      await db.client.close();
    } else if (dbType === 'sqlite') {
      db.close();
    }
    console.log('Database connection closed');
  }
}

module.exports = {
  initializeDatabase,
  getDatabase,
  closeDatabase,
  dbType,
  dbConfig,
};