const { pool } = require('../database-setup');

function getAllVeranstaltungen(callback) {
    pool.query('SELECT * FROM `veranstaltungen`', (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getVeranstaltungInformationByID(veranstaltungsID, callback) {
    pool.query('SELECT * FROM `veranstaltungs_teilnahme` WHERE VeranstaltungsID = ?', [veranstaltungsID], (err, results, fields) => {
        callback(err, results, fields);
    });
}

module.exports = {
    getAllVeranstaltungen,
    getVeranstaltungInformationByID
}

