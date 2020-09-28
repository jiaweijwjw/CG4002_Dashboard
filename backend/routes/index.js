const express = require('express');
const router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  res.redirect('/main');
  // res.render('index', { title: 'Express' });
})

/* router.get('/', function(req, res, next) { 
  res.send('respond with a resource');
}); */

module.exports = router;