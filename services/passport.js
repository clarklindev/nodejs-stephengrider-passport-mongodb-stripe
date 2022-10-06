const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');

const User = mongoose.model('users');

//makes a cookie from mongoose user model using id
passport.serializeUser((user, done) => {
  done(null, user.id); //user.id is the mongodb id
});

//deserialize cookie - takes what we passed into serializeUser() and does the opposite (ie returns user)
passport.deserializeUser(async (id, done) => {
  //search for user
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },

    //STEP4 - this callback function is called AFTER call to passport.authenticate('google')
    async (accessToken, refreshToken, profile, done) => {
      console.log('accessToken: ', accessToken);
      console.log('refreshToken: ', refreshToken);
      console.log('profile: ', profile);

      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser); //first param is error object, second param is userRecord
      }
      //no user in db
      //async call
      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
