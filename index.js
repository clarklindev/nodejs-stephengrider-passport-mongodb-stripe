const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');
const app = express();

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },

    //STEP4 - this callback function is called AFTER call to passport.authenticate('google')
    (accessToken, refreshToken, profile, done) => {
      console.log('accessToken: ', accessToken);
      console.log('refreshToken: ', refreshToken);
      console.log('profile: ', profile);
    }
  )
);

// app.get('/', (req, res) => {
//   res.send({ bye: 'bye' });
// });

//STEP 1 - DIRECT USER TO GOOGLE FOR AUTHENTICATION
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

//STEP 2 - GOOGLE GRANTS PERMISSION, THEN USER REDIRECTED BACK TO /auth/google/callback url with "code" in message.
//STEP 3 - PASSPORT STRATEGY SAW CODE IN URL, returns in-exchange user profile/email/accesstoken...
app.get('/auth/google/callback', passport.authenticate('google'));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
