const querystring = require('query-string');
const axios = require('axios');
const jwt = require('jsonwebtoken');
var express = require('express');
const {SERVER_ROOT_URI, JWT_SECRET, UI_ROOT_URI,} = require('../config');
const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI} = require ('../config');
const {FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FACEBOOK_REDIRECT_URI} = require ('../config');

module.exports.getGoogleAuthURL = () => {
  const rootGoogleOauthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const google_options = {
    redirect_uri: `${SERVER_ROOT_URI}/${GOOGLE_REDIRECT_URI}`,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  return `${rootGoogleOauthUrl}?${querystring.stringify(google_options)}`;
}

module.exports.getCurrentUser = (req, res) => {
  console.log("get me");
  try {
    const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
    console.log("decoded", decoded);
    return res.send(decoded);
  } catch (err) {
    console.log(err);
    res.send(null);
  }
}

module.exports.getGoogleUserFromCode = (req, res) => {
  const code = req.body.code.toString();
  getGoogleTokens({
    code,
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: `${SERVER_ROOT_URI}/${REDIRECT_URI}`,
  })
  .then((google_token)=>{
    const {id_token, access_token} = google_token
    getGoogleDataByUser({id_token, access_token})
    .then((google_data) => {
      /*запись в коллекцию Google res.data
        { id:, //via google_id
          user_id: , // к какому user относится
          email:,
          first_name:,
          last_name:,
          picture:,
          locale:,
          verify:
        }
      */
      const jwt_token = jwt.sign(google_data.data.id, JWT_SECRET)
      return res.send({'token': jwt_token})
    })
    .catch((error) => {
      console.error(`Failed to fetch user`);
      throw new Error(error.message);
    });  
  }).catch((error) => {
    console.error(`Failed to getToken`);
    throw new Error(error.message);
  });
}

function getGoogleTokens({code, clientId, clientSecret, redirectUri}) {
  const url = 'https://oauth2.googleapis.com/token';
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  };

  return axios
    .post(
      url
      , querystring.stringify(values)
      , { headers: {'Content-Type': 'application/x-www-form-urlencoded',}}
    )
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });
}

function getGoogleDataByUser({id_token, access_token}){
  const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
  return axios
    .get( 
      url
      ,{ headers: { Authorization: `Bearer ${id_token}`, },}
    )
    .then((res) => res.data)
    .catch((error) => {
      throw new Error(error.message);
    });
}

module.exports.getFacebookAuthURL = ()=>{
  const rootFacebookOauthUrl = "https://www.facebook.com/v12.0/dialog/oauth";
  const facebook_options = {
    redirect_uri: `${SERVER_ROOT_URI}/${FACEBOOK_REDIRECT_URI}`,
    client_id: FACEBOOK_CLIENT_ID,
    response_type: "code",
    auth_type: 'rerequest',
    scope: ['email', 'public_profile'].join(","),
    display: "popup",
   
  };
  return `${rootFacebookOauthUrl}?${querystring.stringify(facebook_options)}`
}

module.exports.getFacebookUserFromCode = (req, res) => {
  const code = req.body.code.toString();
 console.log('f_code', code)
  // getGoogleTokens({
  //   code,
  //   clientId: GOOGLE_CLIENT_ID,
  //   clientSecret: GOOGLE_CLIENT_SECRET,
  //   redirectUri: `${SERVER_ROOT_URI}/${REDIRECT_URI}`,
  // })
  // .then((google_token)=>{
  //   const {id_token, access_token} = google_token
  //   getGoogleDataByUser({id_token, access_token})
  //   .then((google_data) => {
  //     /*запись в коллекцию Google res.data
  //       { id:, //via google_id
  //         user_id: , // к какому user относится
  //         email:,
  //         first_name:,
  //         last_name:,
  //         picture:,
  //         locale:,
  //         verify:
  //       }
  //     */
  //     const jwt_token = jwt.sign(google_data.data.id, JWT_SECRET)
  //     return res.send({'token': jwt_token})
  //   })
  //   .catch((error) => {
  //     console.error(`Failed to fetch user`);
  //     throw new Error(error.message);
  //   });  
  // }).catch((error) => {
  //   console.error(`Failed to getToken`);
  //   throw new Error(error.message);
  // });
}