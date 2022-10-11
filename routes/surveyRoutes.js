const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = (app) => {
  //thanks for voting
  app.get('/api/surveys/thanks', (req, res) => {
    res.send('thanks for voting');
  });

  // middleware which has requirments before function executes
  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    //people receiving the email
    const cleaned_receipients = recipients
      .split(',')
      .map((email) => ({ email: email.trim() })); //conforms to Recipient model

    //survey is used by a user to send emails out to their clients: it asks for feedback by asking a question
    //it is the data
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: cleaned_receipients,
      _user: req.user.id,
      dateSent: Date.now()
    });

    //good place to send an email - pass in 1. content and 2. template
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      //send the mailer
      await mailer.send();

      //save email to db
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
