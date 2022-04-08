const asyncHandler = require("express-async-handler");
const Note = require("../models/noteModel");
const User = require("../models/userModel");

// @desc    Get note
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.status(200).json(notes);
});

// @desc    set note
// @route   POST /api/notes
// @access  Private
const setNote = asyncHandler(async (req, res) => {
  if (!req.body.text || !req.body.title) {
    res.status(400);
    throw new Error("Please add a text field");
  }
  const note = await Note.create({
    user: req.user.id,
    text: req.body.text,
    title: req.body.title,
  });
  res.status(200).json(note);
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error("Note not found");
  }

  const user = await User.findById(req.user.id);

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Make sure the logged in user matches the note user
  if (note.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updateNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updateNote);
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(400);
    throw new Error("Note not found");
  }

  const user = await User.findById(req.user.id);

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  // Make sure the logged in user matches the goal user
  if (note.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await note.remove();

  res.status(200).json({ message: `Delete note ${req.params.id}` });
});

module.exports = { getNotes, setNote, updateNote, deleteNote };
