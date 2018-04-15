const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const config = require('./config/database');
const port = process.env.PORT || 3000;

const app = express();
mongoose.connect(config.db, { useMongoClient: true });
mongoose.Promise = global.Promise;
require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
require('./routers/routers')(app, passport);

app.listen(port, function () {
  console.log('Server is running on port: ' + port);
});
