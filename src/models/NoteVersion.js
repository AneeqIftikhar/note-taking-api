const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;

const NoteVersion = sequelize.define('NoteVersion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  noteId: {  // Explicitly define the foreign key
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {  // Explicitly define the foreign key
    type: DataTypes.UUID,
    allowNull: true,  // Changed to true since onDelete is SET NULL
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1 
  },
  changes: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('changes');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) {
      this.setDataValue('changes', value ? JSON.stringify(value) : null);
    },
  },
}, {
  timestamps: true,
  tableName: 'NoteVersions'
});

module.exports = NoteVersion;
