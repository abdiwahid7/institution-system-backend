const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  file: {
    type: String,
    required: true,
  },
  isForAllUsers: {
    type: Boolean,
    default: false,
  },
  specificStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('assignment', AssignmentSchema);