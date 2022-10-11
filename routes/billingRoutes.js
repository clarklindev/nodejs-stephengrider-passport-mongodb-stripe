const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = (app) => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    //handle token
    console.log('req.body: ', req.body);
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: 'why we are charging: $5 for service credits',
      source: req.body.id
    });

    console.log('charge: ', charge);
    req.user.credits += 5;
    const user = await req.user.save(); //updated user

    res.send(user); //sends user model back to whoever made request
  });
};
