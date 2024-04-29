const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');

var mitgliederRouter = require('./routes/mitglieder');
var haesRouter = require('./routes/haes');
var veranstaltungRouter = require('./routes/veranstaltungen');
var eigentumRouter = require('./routes/eigentum');

const app = express();

app.use(express.json())

app.use(bodyParser.json());
app.use(logger("tiny"));
app.use(cors());

app.use('/mitglieder', mitgliederRouter);
app.use('/haes', haesRouter);
app.use('/veranstaltungen', veranstaltungRouter);
app.use('/eigentum', eigentumRouter);


app.get('/', (req, res) => {
  res.send('Hello World!');
});


module.exports = app;