const app = require('express')()
app.get('/how', (req, res) => {
    res.send('How?');
})
app.get('*', (req, res) => {
  res.send('Hello from Express.js!');
})
app.listen();
