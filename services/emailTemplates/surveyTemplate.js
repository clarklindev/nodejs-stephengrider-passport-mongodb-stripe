const keys = require('../../config/keys');
module.exports = (survey) => {
  return `
    <html>
      <body>
        <div style="text-align:center;">
          <h3>give some input</h3>
          <p>please answer the question:</p>
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/yes">yes</a>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/no">no</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
