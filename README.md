#running the app

## MongoDB

- db

## Stripe (payments)

- when running in dev, need to use tunneling for localhost, login to Ngrok, it has the details to start a tunnel to allow communication between outside and your localhost (specific port).
-

- sendgrid - tracking email receiver interactions

  - remember to use well-formed local urls for dev (include http://)
  - [click tracking](https://docs.sendgrid.com/ui/analytics-and-reporting/click-tracking-html-best-practices)

- Ngrok setup - internet to local host

  ```cmd
    ngrok authtoken YOUR_AUTHTOKEN
  ```

  ```cmd
  //start on port 80
  ngrok http 80
  ```

  ```cmd
  //kill session
  taskkill /f /im ngrok.exe
  ```

  [url](https://www.udemy.com/course/node-with-react-fullstack-web-development/learn/lecture/17196996#overview)
