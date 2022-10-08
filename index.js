const express = require('express');
const mongoose = require('mongoose');
//cookie-session (cookie is a session - actual data stored) vs express-session (stores reference to data - data is stored elsewhere) difference is how data is stored
//cookie-session can only store 4k of data
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

require('./models/User');
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

const PORT = process.env.PORT || 5000;
app.listen(PORT);
