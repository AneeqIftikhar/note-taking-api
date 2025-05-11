const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Note = require('./Note');
const NoteVersion = require('./NoteVersion');
const Attachment = require('./Attachment');
const db = {};

// Add Sequelize and connection instance
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Add models
db.User = User;
db.Note = Note;
db.NoteVersion = NoteVersion;
db.Attachment = Attachment;

// Define associations
// User has many Notes
User.hasMany(Note, {
  foreignKey: 'userId',
  as: 'notes',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Note belongs to User
Note.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Note has many NoteVersions
Note.hasMany(NoteVersion, {
  foreignKey: 'noteId',
  as: 'versions',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// NoteVersion belongs to Note
NoteVersion.belongsTo(Note, {
  foreignKey: 'noteId',
  as: 'note',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// NoteVersion belongs to User (who made the change)
NoteVersion.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});


User.belongsToMany(Note, {
  through: 'NoteShares',
  as: 'sharedNotes',
  foreignKey: 'userId',
  otherKey: 'noteId'
});

Note.belongsToMany(User, {
  through: 'NoteShares',
  as: 'sharedWith',
  foreignKey: 'noteId',
  otherKey: 'userId'
});

// Note has many Attachments
Note.hasMany(Attachment, {
  foreignKey: 'noteId',
  as: 'attachments',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Attachment belongs to Note
Attachment.belongsTo(Note, {
  foreignKey: 'noteId',
  as: 'note',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = db;