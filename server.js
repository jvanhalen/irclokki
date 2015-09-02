// https://github.com/martynsmith/node-irc
// http://expressjs.com/guide/database-integration.html
var database = require('./db');
var irc = require('irc');

// Setup bot
var server = 'irc.quakenet.org';
var channels = ['#karelia.test'];
var nick = 'irclokki' + Math.floor(Math.random()*10000);

var db = new database();
db.init();

var express = require('express');
var app = express();

app.get('/', function(req, res){
  db.read(20, function(err, data) {
    console.log("/ returned", data);
    res.format({
      'text/html': function() {
        res.send(data);
      }
    });
  });
});

// Create a new bot object
var client = new irc.Client(server, nick, {
    channels: channels
});

// Handle private messages
client.addListener('pm', function (from, message) {
  var str = from + ' => ME: ' + message;
  var timestamp = Date.now();
  console.log(timestamp + str);
  db.write(timestamp, str);
});

// Handle channel messages
client.addListener('message', function (from, to, message) {
  var str = from + ' => ' + to + ': ' + message;
  var timestamp = Date.now();
  console.log(timestamp + str);
  db.write(timestamp, str);
});

// Handle errors
client.addListener('error', function(message) {
    console.log(Date.now() + ' ' + 'error: ', message);
});

app.listen(process.env.OPENSHIFT_NODEJS_PORT, process.env.OPENSHIFT_NODEJS_IP);
