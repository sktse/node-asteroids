var api_validation = require('./api_validation.js');
var scores = require('./scores.js');

var endpoint = api_validation.endpoint;

exports.getHighScores = endpoint(['limit'], function(req, conn, error, success) {
    scores.getHighScores(conn, req.params.limit, error, success);
});

exports.postHighScore = endpoint(['name', 'score'], function(req, conn, error, success) {
    var user_id = null;
    if (typeof(req.params.user_id) != 'undefined') {
        user_id = req.params.user_id;
    }
    scores.postHighScore(conn, user_id, req.params.name, req.params.score, error, success);
});
