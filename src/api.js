var restify = require('restify');

var endpoints = require('./endpoints.js');

var server = restify.createServer();
server.pre(restify.pre.sanitizePath());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.gzipResponse());
server.use(restify.CORS());

server.get('/score/top', endpoints.getHighScores);
server.post('/score/top', endpoints.postHighScore);


var ipAddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
server.listen(port, ipAddress, function () {
  console.log('%s listening at %s', server.name, server.url);
});
