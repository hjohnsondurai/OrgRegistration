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

// If we wish to serve the client application's file from the serve
// app.get('*', function (req, res) {
//     res.sendFile(path.join(path_public, 'index.html'));
// });

let mailConfig = require('./config.json');

mailer.extend(app, mailConfig);

app.post("/sendOTP", function (req, res, next) {
    try{
        if (req.body['to'] == undefined || req.body['subject'] == undefined || req.body['username'] == undefined || req.body['otp'] == undefined) {
            res.send(400, { SERVER_RESPONSE: 0, SERVER_MESSAGE: "Invalid data!" });
            return;
        }

        app.mailer.send('otp', req.body, function (err, message) {
            if (err) {
                console.log(err);
                res.json({ SERVER_RESPONSE: 0, SERVER_MESSAGE: 'There was an error sending the email' });
                return;
            }
            return res.json({ SERVER_RESPONSE: 1, SERVER_MESSAGE: 'Email has been sent!' });
        });
    }
    catch(err){
        res.send(400, { SERVER_RESPONSE: 0, SERVER_MESSAGE: "Server process failed!" });
    }
});

server.listen(process.env.PORT || 1337, function (err) {
    if (!err)
        console.log('Successfully started server at ' + (process.env.PORT || 1337) + ' in ' + process.env.NODE_ENV + ' environment.');
    else
        console.log(err)
});
