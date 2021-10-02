var express = require('express');
var router = express.Router();
const {getCurrentUser, getGoogleUserFromCode, getGoogleAuthURL} = require('../controller/authController');
const {REDIRECT_URI, SERVER_ROOT_URI,UI_ROOT_URI} = require ('../config');

/* temorary */
var axios = require('axios');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

// Getting login URL
router.get("/auth/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});

// Getting the user from Google with the code
router.get(`/${REDIRECT_URI}`, (request, response)=>{
  const code = request.query.code.toString();
  axios
  .post(
    `${SERVER_ROOT_URI}/${REDIRECT_URI}`
    , {code:code}
  ).then((res)=>{
    console.log('res',res.data)
    response.redirect(UI_ROOT_URI)
  })
  
})
router.post(`/${REDIRECT_URI}`, getGoogleUserFromCode)
router.get("/auth/me", getCurrentUser);

module.exports = router;