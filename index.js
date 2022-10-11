const express = require('express');
const mongoose = require('mongoose');
//cookie-session (cookie is a session - actual data stored) vs express-session (stores reference to data - data is stored elsewhere) difference is how data is stored
//cookie-session can only store 4k of data
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json()); //as requests that has request body comes through, parser parses body and asign it to req.body

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days *(as milliseconds)
    keys: [keys.cookieKey] //key to encrypt cookie
  })
);

//tell passport to use cookies to handle authentication
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
  //express will serve up production assets
  //like main.js or main.css file
  app.use(express.static('client/build'));

  //express will serve up index.html, if it doesnt recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
