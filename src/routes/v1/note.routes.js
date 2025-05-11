const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { validate } = require('../../middleware/validation');
const upload = require('../../middleware/upload');
const {
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
} = require('../../controllers/note.controller');
const {
  createNoteSchema,
  updateNoteSchema,
  shareNoteSchema
} = require('../../validations/note.validation');

// Apply authentication to all note routes
router.use(authenticate);

// Create a new note
router.post('/', validate(createNoteSchema), createNote);

// Get all notes (with optional search)
router.get('/', getNotes);

// Get a specific note
router.get('/:id', getNote);

// Update a note
router.patch('/:id', validate(updateNoteSchema), updateNote);

// Delete a note
router.delete('/:id', deleteNote);

// Share a note with another user
router.post('/:id/share', validate(shareNoteSchema), shareNote);

// Get note versions
router.get('/:id/versions', getNoteVersions);

// Revert a note to a specific version
router.post('/:id/revert/:versionId', revertNoteToVersion);

// Get all deleted notes
router.get('/deleted', getDeletedNotes);

router.post('/:noteId/attachments', upload.single('file'), addAttachment);

module.exports = router;