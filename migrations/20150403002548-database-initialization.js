var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.runSql(
        "CREATE TABLE highscores (" +
        "    refid serial NOT NULL PRIMARY KEY," +
        "    user_id uuid NOT NULL,"
        "    name TEXT NOT NULL," +
        "    score BIGINT NOT NULL," +
        "    \"timestamp\" timestamp with time zone NOT NULL DEFAULT NOW())",
        [],
        function(err) {
            if (err) {
                callback(err);
                return;
            }
            db.runSql("ALTER TABLE highscores " +
                      "ADD CONSTRAINT user_id_unique_id " +
                      "UNIQUE (user_id)",
                      [],
                      callback);
        });
};

exports.down = function(db, callback) {
    db.runSql(
        "DROP TABLE highscores",
        [],
        callback);
};
