var pg = require('pg');
var curry = require('curry');

var e = exports;

function trycatch(done, fn, notes) {
    try {
        fn();
    }
    catch (e) {
        var timestamp = (new Date()).toISOString();
        console.trace(timestamp + ": unhandled exception: " + e);
        if (notes) {
            console.log(timestamp + ": notes: " + notes);
        }

        if (done !== null && typeof(done) != 'undefined') {
            done(e);
        }

        throw e;
    }
}

function query(done, query, params, error, success) {
    var client = this.client;

    if (arguments.length == 3) {
        var result;
        trycatch(done, function() {
            result = client.query(query, params);
        }, query);
        return result;
    }

    var callback = function(err, result) {
        if (err) {
            trycatch(done, function() {
                error(err);
            }, query);
            return;
        }

        var resultObj = {
            result: result,
            getAll: function() {
                return result['rows'];
            },
            getRow: function(index) {
                return result['rows'][index];
            },
            get: function() {
                var index = 0;
                var key;

                if (arguments.length == 2) {
                    index = arguments[0];
                    key = arguments[1];
                }
                else {
                    key = arguments[0];
                }

                return result['rows'][index][key];
            },
            getCount: function() {
                return result['rows'].length;
            },
            getAffectedCount: function() {
                return result['rowCount'];
            }
        };

        trycatch(done, function() {
            success(resultObj);
        }, query);
    };

    return client.query(query, params, callback);
}

function mquery(done, list, error, success) {
    if ((list.length % 2) != 0 || list.length == 0) {
        trycatch(done, function() {
            error("Invalid list");
        });
        return;
    }

    var self = this;
    var client = this.client;

    var sql = list.shift();
    var params = list.shift();

    var onSuccess = function(result) {
        if (list.length == 0) {
            trycatch(done, function() {
                success(result);
            });
            return;
        }

        mquery.apply(self, [done, list, error, success]);
    };

    query.apply(self, [done, sql, params, error, onSuccess]);
}

e.open = function(connString, error, success) {
    pg.connect(connString, function(err, client, done) {
        var onError = function(err) {
            trycatch(done, function() {
                error(err, done);
            });
        };

        if (err) {
            onError(err);
            return;
        }

        var conn = {
            connString : connString,
            client: client
        };

        conn.query = curry([done], query, conn);
        conn.mquery = curry([done], mquery, conn);

        success(conn, done);
    });
}

//calls pg.end
e.end = function() {

    pg.end();
};

var isDefined = function(value) {
    return (typeof(value) != 'undefined') && value != 'undefined';
};

e.getConnectionString = function() {
    var connectionString = process.env.OPENSHIFT_POSTGRESQL_DB_URL;
    if (!isDefined(connectionString)) {
        throw "Missing database connection string";
    }
    return connectionString;
}
