const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');

const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = (app) => {
  //get all surveys by user
  app.get('/api/surveys', async (req, res) => {
    //ask mongoose for all surveys that are in db (survey._user) created by current user (req.user)
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    //but we dont want all recipients of the email...mongoose use query (projection)

    res.send(surveys);
  });

  //thanks for voting
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('thanks for voting');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    console.log('req.body: ', req.body);
    // res.send({});
    const p = new Path('/api/surveys/:surveyId/:choice');

    //note: sendgrid sends back individual click events
    const events = req.body
      .filter(({ email, url, event }) => {
        //makesure event is a click, has email and url...
        return email && url && event === 'click';
      })
      .map(({ email, url }) => {
        if (url) {
          const match = p.test(new URL(url).pathname); //extract p from url
          if (match) {
            return {
              email,
              surveyId: match.surveyId,
              choice: match.choice
            };
          }
        }
      });

    events.filter((event) => {
      //remove undefined - !! turns into bolean
      return !!event;
    });

    events.every(({ surveyId, email, choice }) => {
      console.log('every is called: ', surveyId, email, choice);
      Survey.updateOne(
        {
          _id: surveyId, //mongodb uses _id instead of id
          recipients: {
            $elemMatch: { email: email, responded: false }
          }
        },
        {
          $inc: { [choice]: 1 }, //set yes/no: 1
          $set: { 'recipients.$.responded': true }, //updates the specific recipient found
          lastResponded: new Date()
        }
      ).exec();
    });
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
