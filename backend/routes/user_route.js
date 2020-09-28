const express = require('express'); // combined into: const router = require('express').Router();
const router = express.Router();
const User = mongoose.model('User', userSchema);

/* 
HTTP GET request.
file (module) name is important. the following route will be used when a URL of /users/ is received.

*/
// next argument doesnt do anything here but it may be useful in the future if you want to add 
// multiple route handlers to the '/' route path.
router.get('/', function(req, res, next) { 
  res.send('respond with a resource');
});
/*
let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username;

  const newUser = new User({username});

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});
*/

module.exports = router;