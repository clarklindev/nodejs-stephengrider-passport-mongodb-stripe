// prod.js (SHOULD COMMIT THIS - gets VARS FROM HEROKU ENV VARIABLES)
module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookClientID: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,

  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  mailchimpKey: process.env.MAILCHIMP_KEY,
  sendgridKey: process.env.SENDGRID_KEY,
  sendFromEmail: process.env.SEND_FROM_EMAIL,
  redirectDomain: process.env.REDIRECT_DOMAIN
};
