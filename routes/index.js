var express = require('express');
var router = express.Router();
const {getCurrentUser, getGoogleUserFromCode, getGoogleAuthURL} = require('../controller/authController');
const {getFacebookUserFromCode, getFacebookAuthURL} = require('../controller/authController');
const {GOOGLE_REDIRECT_URI, FACEBOOK_REDIRECT_URI, SERVER_ROOT_URI, UI_ROOT_URI} = require ('../config');

/* temorary */
var axios = require('axios');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

// Getting login URL BY GOOGLE
router.get("/auth/google/url", (req, res) => {
  return res.send(getGoogleAuthURL());
});

// Getting the user from Google with the code
router.get(`/${GOOGLE_REDIRECT_URI}`, (request, response)=>{
  const code = request.query.code.toString();
  axios
  .post(
    `${SERVER_ROOT_URI}/${GOOGLE_REDIRECT_URI}`
    , {code:code}
  ).then((res)=>{
    console.log('res',res.data)
    response.redirect(UI_ROOT_URI)
  })
  
})
router.post(`/${GOOGLE_REDIRECT_URI}`, getGoogleUserFromCode)

router.get("/auth/me", getCurrentUser);

// Getting login URL BY FACEBOOK
router.get("/auth/facebook/url", (req, res) => {
  return res.send(getFacebookAuthURL());
});

router.get(`/${FACEBOOK_REDIRECT_URI}`, (request, response)=>{
  const code = request.query.code.toString();
  axios
  .post(
    `${SERVER_ROOT_URI}/${FACEBOOK_REDIRECT_URI}`
    , {code:code}
  ).then((res)=>{
    console.log('res',res.data)
    response.redirect(UI_ROOT_URI)
  })
})

router.post(`/${FACEBOOK_REDIRECT_URI}`, getFacebookUserFromCode)





module.exports = router;