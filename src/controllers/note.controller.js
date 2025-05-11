const noteService = require('../services/note.service');
const upload = require('../middleware/upload');

const createNote = async (req, res, next) => {
  try {
    const note = await noteService.createNote(req.user.id, req.body);
    res.status(201).json({
      status: 'success',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

const getNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getUserNotes(req.user.id, req.query.search);
    res.json({
      status: 'success',
      results: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

const getNote = async (req, res, next) => {
  try {
    const note = await noteService.getNoteById(req.params.id, req.user.id);
    res.json({
      status: 'success',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const note = await noteService.updateNote(
      req.params.id,
      req.user.id,
      req.body
    );
    res.json({
      status: 'success',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    await noteService.deleteNote(req.params.id, req.user.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

const shareNote = async (req, res, next) => {
  try {
    await noteService.shareNote(
      req.params.id,
      req.user.id,
      req.body.userId
    );
    res.json({
      status: 'success',
      message: 'Note shared successfully'
    });
  } catch (error) {
    next(error);
  }
};

const getNoteVersions = async (req, res, next) => {
  try {
    const versions = await noteService.getNoteVersions(req.params.id, req.user.id);
    res.json({
      status: 'success',
      data: versions
    });
  } catch (error) {
    next(error);
  }
};

const revertNoteToVersion = async (req, res, next) => {
  try {
    const note = await noteService.revertNoteToVersion(req.params.id, req.user.id, req.params.versionId);
    res.json({
      status: 'success',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

const getDeletedNotes = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const deletedNotes = await noteService.getDeletedNotes(userId);
    res.json({
      status: 'success',
      data: deletedNotes
    });
  } catch (error) {
    next(error);
  }
};


const addAttachment = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }
    const result = await noteService.addAttachment(noteId, req.user.id, req.file.path, req.file.mimetype);
    res.json(result);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  shareNote,
  getNoteVersions,
  revertNoteToVersion,
  getDeletedNotes,
  addAttachment
};