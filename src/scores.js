var uuid = require('node-uuid');

var e = exports;

e.getHighScores = function(conn, limit, error, success) {
    conn.query(
        "SELECT name, score FROM highscores ORDER BY score DESC LIMIT $1",
        [limit],
        error,
        function(result) {
            success({
                "scores": result.getAll()
            });
        }
    );
};

e.postHighScore = function(conn, user_id, name, score, error, success) {

    var insertNewScore = function(conn, name, score, user_id, error, success) {
        conn.query(
            "INSERT INTO highscores (user_id, name, score) VALUES ($1, $2, $3)",
            [user_id, name, score],
            error,
            success
        );
    }

    if (user_id == null) {
        //new user, new score entry
        user_id = uuid.v4();
        insertNewScore(conn, name, score, user_id, error,
            function(result) {
                success({
                    "user_id": user_id
                });
            }
        );
    }
    else {
        //existing user score, and it should exist in the database
        conn.query(
            "SELECT * FROM highscores WHERE user_id = $1",
            [user_id],
            error,
            function(result) {
                if (result.getCount() == 0) {
                    //we lost the user somehow, just insert it into the database
                    insertNewScore(conn, name, score, user_id, error,
                        function(result) {
                            success({
                                "user_id": user_id
                            });
                        }
                    );
                }
                else {
                    //update the existing user's high score
                    conn.query(
                        "UPDATE highscores " +
                        "SET name = $1, score = $2, timestamp = NOW() " +
                        "WHERE user_id = $3",
                        [name, score, user_id],
                        error,
                        function(result) {
                            success({
                                "user_id": user_id
                            });
                        }
                    )
                }
            }
        );
    }

};
