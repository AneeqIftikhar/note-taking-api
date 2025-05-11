const { DataTypes } = require('sequelize');
const sequelize = require('../config/database').sequelize;
const NoteVersion = require('./NoteVersion');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: { 
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 255],
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  timestamps: true,
  paranoid: true, // Soft delete
  tableName: 'Notes',
  indexes: [
    {
      type: 'FULLTEXT',
      fields: ['title', 'content'],
    },
  ],
});

// Add instance method to create a new version
Note.prototype.createVersion = async function(userId) {
  return this.createVersion({
    title: this.title,
    content: this.content,
    version: this.version,
    noteId: this.id,
    userId: userId || this.userId,
  });
};

Note.prototype.revertToVersion = async function(versionId) {
  const version = await NoteVersion.findByPk(versionId);
  if (!version) {
    throw new Error('Version not found');
  }
  await this.update({
    title: version.title,
    content: version.content,
    version: version.version
  });
};

module.exports = Note;