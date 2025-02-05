const { pool } = require('../database-setup');

function getAllVeranstaltungen(callback) {
    pool.query('SELECT * FROM `VeranstaltungsDetails`', (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getVeranstaltungInformationByID(veranstaltungsID, callback) {
    pool.query('SELECT * FROM `HaesUmzugsTeilnahmeDetails` WHERE VeranstaltungsID = ?', [veranstaltungsID], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function addVeranstaltung(Mitglied, callback) {
    const { Datum, Ort, VeranstaltungsArtID } = Mitglied;

    const query = 'INSERT INTO `Veranstaltung`(Datum, Ort, VeranstaltungsArtID) VALUES (?, ?, ?);';

    pool.query(query, [Datum, Ort, VeranstaltungsArtID], (err, results, fields) => {
        callback(err, results, fields);
    });
};

module.exports = {
    getAllVeranstaltungen,
    getVeranstaltungInformationByID,
    addVeranstaltung
}