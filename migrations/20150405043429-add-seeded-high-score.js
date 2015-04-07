var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
    db.runSql("INSERT INTO highscores (user_id, name, score) "
              "VALUES ($1, $2, $3)",
              [
                "e49f95d9-a596-4785-bb5b-a5fcfc3b0b25",
                "roychlngefndr",
                0],
                callback);
};

exports.down = function(db, callback) {
    db.runSql("DELETE FROM highscores WHERE user_id = $1",
              ["e49f95d9-a596-4785-bb5b-a5fcfc3b0b25"],
              callback);
};
