// OJO: Primero instalar módulos minimist y serve-static

// ESTE ES EL SERVIDOR

'use strict';
var http = require('http');
var serveStatic = require('serve-static');
var serve = serveStatic('public');
var minimist = require('minimist');

var argv = minimist(process.argv);
// var flag = 0;
var users = {};
var tweets;
var server = http.createServer(function(req, res) {

   if (req.url === '/data') {
       console.log('recibi un get', users);
       if (req.method === 'GET') {
           tweets = [];
           res.writeHead(200, {
               'Content-Type': 'application/json'
           });

           Object.keys(users).forEach(function(curEl, curIndex, array) {
               
               if (curEl !== req.headers.user) {
                    
                   if (users[curEl] !== undefined) {
                       users[curEl].forEach(function(curtw) {
                           // console.log(curtw.timestamp);
                           // console.log(req.headers.timestamp);
                           // console.log(curtw.timestamp > req.head.timestamp);
                           if (curtw.timestamp > req.headers.timestamp) {
                               console.log('antes del push');
                               tweets.push(curtw);
                               // flag=curtw.timestamp;
                           }
                       });
                   }
               }

           });


           // por cada user en users, si es distinto a req.headers.user,
           // entonces recorrer su array de tweets ->
           // por cada tweet, preguntar si su propiedad timestamp es mayor
           // a req.headers.timestamp, si lo es entonces agregar el tweet
           // en cuestión al array tweets


           // responder el contenido de tweets transformado a string

           // console.log(tweets);
           res.end(JSON.stringify(tweets));
           return;
       }
   }

   var tweet;

   if (req.url === '/tweet') {
       if (req.method === 'POST') {
           console.log('recibi un post');
           tweet = '';
           req.setEncoding('utf8');

           req.on('data', function(data) {
               tweet += data;
           });

           req.on('end', function() {
               tweet = JSON.parse(tweet);
               tweet.timestamp = req.headers.timestamp;
               tweet.user = {
                   name: req.headers.user
               };
               if (users[req.headers.user]) {
                   users[req.headers.user].push(tweet);
               } else {
                   users[req.headers.user] = [tweet];
               }

               res.writeHead(200);
               res.end('{}');
           });
           return;
       }
   }

   // parte dónde sirvo contenido estático
   serve(req, res, function() {
       res.end();
   });
});

var port = argv.port || process.env.PORT || process.env.port || process.env.OPENSHIFT_NODEJS_PORT || 8000;

server.listen(port, argv.ip || process.env.OPENSHIFT_NODEJS_IP, function() {
   console.log('Server is now listening at port: ' + port);
});