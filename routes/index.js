var express = require('express');
var router = express.Router();
const {getCurrentUser, getGoogleUserFromCode, getGoogleAuthURL} = require('../controller/authController');
const {REDIRECT_URI} = require ('../config');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Getting login URL
router.get("/auth/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});

// Getting the user from Google with the code
router.get(`/${REDIRECT_URI}`, getGoogleUserFromCode)

router.get("/auth/me", getCurrentUser);

module.exports = router;