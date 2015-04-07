
var user = process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME
var password = process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD;
var host = process.env.OPENSHIFT_POSTGRESQL_DB_HOST;
var port = process.env.OPENSHIFT_POSTGRESQL_DB_PORT;

module.exports = {
    "dev": {
        "driver": "pg",
        "user": "postgres",
        "password": "postgres",
        "host": "localhost",
        "port": "1234",
        "database": "asteroids"
    },

    "prod": {
        "driver": "pg",
        "user": user,
        "password": password,
        "host": host,
        "port": port,
        "database": "asteroidsapi"
    }
};
