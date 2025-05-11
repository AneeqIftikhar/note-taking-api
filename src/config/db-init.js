const { sequelize } = require('./database');
const logger = require('../utils/logger');

// Import models to ensure they're registered with Sequelize
const User = require('../models/User');
const Note = require('../models/Note');
const NoteVersion = require('../models/NoteVersion');

async function initDB() {
  try {
    // Test the connection
    await sequelize.authenticate();
    logger.info('✅ Database connection has been established successfully.');

    // Disable foreign key checks before dropping tables
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop all tables if force is true
    if (process.env.FORCE_SYNC === 'true') {
      logger.warn('⚠️  Dropping all tables...');
      await sequelize.drop();
    }

    // Create all tables at once
    await sequelize.sync({ 
      force: process.env.FORCE_SYNC === 'true',
      alter: process.env.NODE_ENV === 'development' // Optional: auto-update schema in development
    });
    logger.info('✅ All tables created successfully');


    return sequelize;
  } catch (error) {
    logger.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    // Always re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1').catch(() => {});
  }
}

module.exports = initDB;
