const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const InviteCode = require('../models/inviteCode');
const User = require('../models/user');

// Generate invite codes
// Use '?count=<Number>' to provide quantity
router.put('/invite-codes', (req, res) => {
  let randStrArr = [];
  for (let i = 0; i < req.query.count; i++) {
    const randStr = crypto.randomBytes(20).toString('hex');
    const inviteCode = new InviteCode({
      code: randStr,
      username: null,
    });
    inviteCode.save().catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
    randStrArr.push(randStr);
  }
  console.log(`Generate ${req.query.count} invite codes successfully!`);
  console.log(randStrArr);
  res.status(200).json(randStrArr);
});

// Get all invite codes
router.get('/invite-codes', (req, res) => {
  let docsArr = [];
  InviteCode.find()
    .then(docs => {
      docsArr = docs.map(({ code, username }) => ({ code, username }));
      console.log(docsArr);
      res.json(docsArr);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

// Register
router.post('/register', (req, res) => {
  InviteCode.findOneAndUpdate({ code: req.body.inviteCode }, { username: req.body.username })
    .then(doc => {
      if (!doc) {
        console.log(`User [ ${req.body.username} ] try to register, but the invite code is wrong.`);
        res.status(404).json({ error: 'Invite code not found' });
      } else if (doc.username) {
        console.log(`User [ ${req.body.username} ] try to register, but the invite code has been used.`);
        res.status(404).json({ error: 'Invite code error' });
      } else {
        const user = new User({
          username: req.body.username,
          password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
        });
        user
          .save()
          .then(result => {
            console.log(`User [ ${result.username} ] register successfully!`);
            res.sendStatus(200);
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ error: err });
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

// Verify that the username is duplicated
router.get('/username/:username', (req, res) => {
  User.findOne({ username: req.params.username })
    .then(doc => {
      if (doc) {
        console.log(`User [ ${req.params.username} ] has already registered.`);
        res.json({ registered: true });
      } else {
        console.log(`User [ ${req.params.username} ] is not found.`);
        res.status(404).json({ registered: false });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

// Login
router.post('/login', (req, res) => {
  User.findOne({
    username: req.body.username,
    password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
  })
    .then(doc => {
      if (doc.length !== 0) {
        console.log(`User [ ${req.body.username} ] login successfully.`);
        res.sendStatus(200);
      } else {
        console.log(`User [ ${req.body.username} ] login error.`);
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
