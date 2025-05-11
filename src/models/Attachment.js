const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const Attachment = sequelize.define('Attachment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  noteId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true,
  paranoid: true, // Enable soft delete
  tableName: 'Attachments'
});

module.exports = Attachment;