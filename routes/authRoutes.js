const passport = require('passport');

module.exports = (app) => {
  //STEP 1 - DIRECT USER TO GOOGLE FOR AUTHENTICATION

  //google
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account'
    })
  );

  //STEP 2 - GOOGLE GRANTS PERMISSION, THEN USER REDIRECTED BACK TO /auth/google/callback url with "code" in message.
  //STEP 3 - PASSPORT STRATEGY SAW CODE IN URL, returns in-exchange user profile/email/accesstoken...
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  //facebook
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
