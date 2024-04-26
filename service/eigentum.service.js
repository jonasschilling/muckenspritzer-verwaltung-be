const { pool } = require('../database-setup');

function addEigentum(haesID, eigentuemer, zeitstempel, callback) {
    pool.query('INSERT INTO `eigentum` (Haes, Eigentuemer, Zeitstempel) VALUES (?, ?, ?)', [haesID, eigentuemer, zeitstempel], (err, results, fields) => {
        callback(err, results, fields);
    });
}

module.exports = {
    addEigentum
}