const { pool } = require('../database-setup');

function getAllVeranstaltungen(callback) {
    pool.query('SELECT * FROM `Veranstaltung`', (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getVeranstaltungInformationByID(veranstaltungsID, callback) {
    pool.query('SELECT * FROM `HaesUmzugsTeilnahme` WHERE VeranstaltungsID = ?', [veranstaltungsID], (err, results, fields) => {
        callback(err, results, fields);
    });
}

module.exports = {
    getAllVeranstaltungen,
    getVeranstaltungInformationByID
}