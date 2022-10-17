const re =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateEmails = (emails) => {
  const invalidEmails = emails
    .split(',')
    .map((email) => email.trim())
    .filter((email) => {
      console.log('email: ', email, ', validate: ', re.test(email));

      return re.test(email) === false; //emailregex.
    });

  if (invalidEmails.length) {
    return `these emails are invalid: ${invalidEmails}`;
  }

  return;
};

export default validateEmails;
