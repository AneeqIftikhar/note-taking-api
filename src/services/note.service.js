const { Op } = require('sequelize');
const sequelize = require('../config/database').sequelize; // Add this line
const { Note, NoteVersion, User, Attachment } = require('../models');
const { NotFoundError, ValidationError } = require('../utils/errors');
const { setCache, getCache, invalidateCache } = require('../utils/cache');

class NoteService {
  async createNote(userId, noteData) {
    const note = await Note.create({
      title: noteData.title,
      content: noteData.content,
      userId,
      version: 1 
    });

    // Create initial version
    await NoteVersion.create({
      title: note.title,
      content: note.content,
      noteId: note.id,
      version: 1 
    });

    return this.getNoteById(note.id, userId);
  }

  async getNoteById(noteId, userId) {
    const note = await Note.findOne({
      where: {
        id: noteId,
        [Op.or]: [
          { userId }, // User is the owner
          { '$sharedWith.id$': userId } // Or user has been shared the note
        ]
      },
      include: [
        {
          model: NoteVersion,
          as: 'versions',
          attributes: ['id', 'version', 'title', 'content', 'createdAt'],
          order: [['version', 'DESC']]
        },
        {
          model: User,
          as: 'sharedWith',
          attributes: ['id', 'username', 'email'],
          through: {
            attributes: [] // This excludes the join table attributes
          }
        }
      ]
    });

    if (!note) {
      throw new NotFoundError('Note not found');
    }

    return note;
  }

  async getUserNotes(userId, search = '') {
    const cacheKey = `user:${userId}:notes:${search}`;
    const cachedNotes = await getCache(cacheKey);
  
    if (cachedNotes) {
      return cachedNotes;
    }
  
    const searchCondition = search ? sequelize.literal(`MATCH(title, content) AGAINST('${search}' IN NATURAL LANGUAGE MODE)`) : {};
    const notes = await Note.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              { userId }, // User is the owner
              { '$sharedWith.id$': userId } // Or user has been shared the note
            ]
          },
          searchCondition
        ]
      },
      include: [
        {
          model: NoteVersion,
          as: 'versions',
          attributes: ['id', 'version', 'title', 'content', 'createdAt'],
          order: [['version', 'DESC']],
          limit: 1
        },
        {
          model: User,
          as: 'sharedWith',
          attributes: ['id', 'username', 'email'],
          through: {
            attributes: [] // This excludes the join table attributes
          }
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    await setCache(cacheKey, notes);

    return notes;
  }

  // Invalidate cache when a note is updated
  async updateNote(noteId, userId, updateData) {
    const note = await Note.findOne({
      where: {
        id: noteId,
        userId
      }
    });
  
    if (!note) {
      throw new NotFoundError('Note not found');
    }
  
    // Check for version match
    if (updateData.version !== note.version) {
      throw new Error('The note has been modified by another transaction');
    }
  
    // Increment the version number
    const newVersionNumber = note.version + 1;
  
    // Update note
    await note.update({
      title: updateData.title || note.title,
      content: updateData.content || note.content,
      version: newVersionNumber
    });
  
    // Create new version
    await NoteVersion.create({
      title: note.title,
      content: note.content,
      noteId: note.id,
      version: newVersionNumber
    });

    // Invalidate cache
    const cacheKey = `user:${userId}:notes:*`;
    await invalidateCache(cacheKey);
  
    return this.getNoteById(noteId, userId);
  }

  async deleteNote(noteId, userId) {
    const note = await Note.findByPk(noteId);
    
    if (!note) {
      throw new NotFoundError('Note not found');
    }

    if (note.userId !== userId) {
      throw new UnauthorizedError('Not authorized to delete this note');
    }

    await note.destroy(); // This will perform a soft delete

    // Invalidate cache
    const cacheKey = `user:${userId}:notes:*`;
    await invalidateCache(cacheKey);

    return { success: true };
  }

  async shareNote(noteId, userId, sharedWithUserId) {
    const note = await Note.findByPk(noteId, {
      include: ['sharedWith']
    });
    
    if (!note) {
      throw new NotFoundError('Note not found');
    }

    if (note.userId !== userId) {
      throw new UnauthorizedError('Not authorized to share this note');
    }

    // Prevent sharing with self
    if (userId === sharedWithUserId) {
      throw new ValidationError('Cannot share note with yourself');
    }

    // Check if already shared
    const isAlreadyShared = note.sharedWith.some(user => user.id === sharedWithUserId);
    if (isAlreadyShared) {
      throw new ValidationError('Note already shared with this user');
    }

    // Add user to sharedWith
    await note.addSharedWith(sharedWithUserId);
    
    return { success: true };
  }

  async getNoteVersions(noteId, userId) {
    // First check if the user has access to the note
    const note = await Note.findOne({
      where: {
        id: noteId,
        [Op.or]: [
          { userId }, // User is the owner
          { '$sharedWith.id$': userId } // Or user has been shared the note
        ]
      }
    });

    if (!note) {
      throw new NotFoundError('Note not found');
    }

    // Fetch all versions of the note
    const versions = await NoteVersion.findAll({
      where: { noteId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email']
      }],
      order: [['version', 'DESC']],
      attributes: [
        'id',
        'title',
        'content',
        'version',
        'createdAt'
      ]
    });

    return versions;
  }

  async revertNoteToVersion(noteId, userId, versionId) {
    const note = await Note.findOne({
      where: {
        id: noteId,
        userId
      }
    });
  
    if (!note) {
      throw new NotFoundError('Note not found');
    }
  
    await note.revertToVersion(versionId);
    return this.getNoteById(noteId, userId);
  }

  async searchNotes(query) {
    return Note.findAll({
      where: sequelize.where(
        sequelize.fn('MATCH', sequelize.literal('title, content')),
        {
          [Op.match]: sequelize.literal(`AGAINST('${query}' IN NATURAL LANGUAGE MODE)`)
        }
      ),
      order: [['updatedAt', 'DESC']]
    });
  }

  async getDeletedNotes(userId) {
    return Note.findAll({
      where: {
        userId,
        deletedAt: {
          [Op.ne]: null
        }
      },
      paranoid: false, // Include soft-deleted records
      order: [['deletedAt', 'DESC']]
    });
  }

  async addAttachment(noteId, userId, filePath, fileType) {
    const note = await Note.findOne({
      where: {
        id: noteId,
        userId // Ensure the note belongs to the user
      }
    });
  
    if (!note) {
      throw new NotFoundError('Note not found or not owned by user');
    }
  
    const attachment = await Attachment.create({
      noteId,
      filePath,
      fileType
    });
  
    return { success: true, attachment };
  }
}

module.exports = new NoteService();