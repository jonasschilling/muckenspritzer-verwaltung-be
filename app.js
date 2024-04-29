const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');

var path = require('path');
var logger = require('morgan');

var mitgliederRouter = require('./routes/mitglieder');
var haesRouter = require('./routes/haes');
var veranstaltungRouter = require('./routes/veranstaltungen');
var eigentumRouter = require('./routes/eigentum');


app.use(bodyParser.json());
app.use(cors());

app.use('/mitglieder', mitgliederRouter);
app.use('/haes', haesRouter);
app.use('/veranstaltungen', veranstaltungRouter);
app.use('/eigentum', eigentumRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Muckenspritzer Verwaltung backend listening on port ${port} .`);
});


module.exports = app;
