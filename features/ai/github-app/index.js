/**
 * Main Entry Point for GitHub App AI Feature
 * Initializes all services: GitHub App, Database, Storage, Cache, and AI Integration
 */

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// Import service modules
const { initializeDatabase, closeDatabase } = require('./database');
const { initializeStorage } = require('./storage');
const { initializeCache } = require('./cache');
const { initializeGitHubApp } = require('./github-app');
const { initializeAI } = require('./ai-integration');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware setup
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GitHub App AI Feature',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GitHub App webhook endpoint
 */
app.post('/webhooks/github', (req, res) => {
  // TODO: Implement GitHub webhook handler
  res.json({ message: 'Webhook received' });
});

/**
 * AI integration endpoint
 */
app.post('/api/ai/analyze', (req, res) => {
  // TODO: Implement AI analysis endpoint
  res.json({ message: 'Analysis endpoint' });
});

/**
 * Initialize all services
 */
async function initializeServices() {
  try {
    console.log('Initializing GitHub App AI services...');
    
    // Initialize database
    console.log('Initializing database...');
    await initializeDatabase();
    
    // Initialize storage
    console.log('Initializing storage...');
    await initializeStorage();
    
    // Initialize cache
    console.log('Initializing cache...');
    await initializeCache();
    
    // Initialize GitHub App
    console.log('Initializing GitHub App...');
    await initializeGitHubApp(app);
    
    // Initialize AI services
    console.log('Initializing AI services...');
    await initializeAI();
    
    console.log('All services initialized successfully!');
    return true;
  } catch (error) {
    console.error('Service initialization error:', error);
    throw error;
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(async () => {
    await closeDatabase();
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(async () => {
    await closeDatabase();
    console.log('Server closed');
    process.exit(0);
  });
});

/**
 * Start server
 */
async function startServer() {
  try {
    await initializeServices();
    
    const server = app.listen(PORT, () => {
      console.log(`\n✅ GitHub App AI Feature server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 GitHub webhooks: http://localhost:${PORT}/webhooks/github`);
      console.log(`🤖 AI API: http://localhost:${PORT}/api/ai/analyze\n`);
    });
    
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer, initializeServices };