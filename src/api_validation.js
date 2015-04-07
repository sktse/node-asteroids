var curry = require('curry');
var util = require('util');

var db = require('./db.js');
var u = require('./utils.js');

exports.endpoint = function(requiredParams, handler) {
    var validator = requiredParamsValidationProvider(requiredParams);

    // API handler
    return function(req, res) {
        // establish DB connection
        (function() {
            var connectionString = db.getConnectionString();
            db.open(connectionString, function(err, done) {
                onError(req, res, done, err);
            }, function(conn, done) {
                var apiFinalErrorHandler = curry([req, res, done], onError);
                var apiFinalSuccessHandler = curry([res, done], onResult);

                validator(req, apiFinalErrorHandler, function() {
                    handler(req, conn, apiFinalErrorHandler, apiFinalSuccessHandler)
                });
            });
        })();
    };
};

var onErrorLogging = function(req, err) {
    var timestamp = (new Date()).toISOString();
    console.log(timestamp + ": " + err);
    console.log(timestamp + ": url: " + req.url);
    console.log(timestamp + ": params: " + JSON.stringify(req.params));
    console.log(timestamp + ": headers: " + JSON.stringify(req.headers));
}

var onError = function(req, res, done, err, status) {
    done(err);
    var headers = {
        "Content-Type": "application/json"
    };
    res.writeHead(status ? status : 500, headers);
    var error;
    if (typeof(err) == "string") {
        error = err;
        onErrorLogging(req, err);
    }
    else {
        error = "Unknown error";
        onErrorLogging(req, util.inspect(err));
    }
    res.end(JSON.stringify({"success":false, "error":error}));
}

var onResult = function(res, done, result) {
    done();

    var headers = {};
    if (!result) {
        headers["Content-Type"] = "application/json";
        res.writeHead(200, headers);
        res.end(JSON.stringify(result));
    }
    else{
        // default is JSON response
        headers["Content-Type"] = "application/json";
        res.writeHead(200, headers);
        result['success'] = true;
        res.end(JSON.stringify(result));
    }
}


var requiredParamsValidationProvider = function(required) {
    return function(req, error, success) {
        for (var i = 0; i < required.length; i++) {
            var requiredParam = required[i];

            //check if all paramters are present
            if (!u.isDefined(req.params[required[i]])) {
                error("Missing required parameter: " + requiredParam, 400);
                return;
            }
        }
        success();
    };
};
