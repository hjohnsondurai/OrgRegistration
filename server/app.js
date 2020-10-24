'use strict';

const express = require('express');
const http = require('http');
const path = require('path');
const configOutput = require('dotenv').config();
const bodyParser = require('body-parser');
const hbs = require('express-handlebars')
const mailer = require('express-mailer');
var cors = require('cors')

let app = express();
let server = http.createServer(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('*', cors())

app.set('views', './app/views')
app.engine('hbs', hbs({
    extname: '.hbs',
    defaultLayout: false
}));
app.set('view engine', '.hbs');

let path_app = path.join(__dirname, 'app');
let path_public = path.join(path_app, 'public');

app.use(express.static(path_public));

server.listen(process.env.PORT || 1337, function (err) {
    if (!err)
        console.log('Successfully started server at ' + (process.env.PORT || 1337) + ' in ' + process.env.NODE_ENV + ' environment.');
    else
        console.log(err)
});
