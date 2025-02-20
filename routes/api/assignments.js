const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const Assignment = require('../../models/Assignment');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// @route    POST api/assignments
// @desc     Create an assignment
// @access   Private/Admin
router.post(
  '/',
  [auth, admin, upload.single('file')],
  [
    check('title', 'Title is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, isForAllUsers, specificStudents } = req.body;
    const file = req.file.filename; // Store only the filename

    try {
      const newAssignment = new Assignment({
        user: req.user.id,
        title,
        description,
        file,
        isForAllUsers: isForAllUsers === 'true', // Convert string to boolean
        specificStudents: specificStudents ? specificStudents.split(',') : [],
      });

      const assignment = await newAssignment.save();
      res.json(assignment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/assignments
// @desc     Get all assignments
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      $or: [
        { user: req.user.id },
        { isForAllUsers: true },
        { specificStudents: req.user.id },
      ],
    });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/assignments/search
// @desc     Search assignments by title
// @access   Private
router.get('/search', auth, async (req, res) => {
  const { title } = req.query;
  try {
    const assignments = await Assignment.find({
      title: { $regex: title, $options: 'i' },
      $or: [
        { user: req.user.id },
        { isForAllUsers: true },
        { specificStudents: req.user.id },
      ],
    });
    res.json(assignments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/assignments/:id
// @desc     Update an assignment
// @access   Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
  const { title, description } = req.body;

  try {
    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }

    assignment.title = title;
    assignment.description = description;

    await assignment.save();
    res.json(assignment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/assignments/:id
// @desc     Delete an assignment
// @access   Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ msg: 'Assignment not found' });
    }

    await assignment.remove();
    res.json({ msg: 'Assignment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;