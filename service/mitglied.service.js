const { pool } = require('../database-setup');

function getAllMitglieder(callback) {
    const query = 'SELECT * FROM `mitglied` ORDER BY Name, Vorname, Geburtsdatum';

    pool.query(query, (err, results, fields) => {
        callback(err, results, fields);
    });
};

function getAllMitgliederHaesEigentuemer(callback) {
    const query = 'SELECT * FROM mitglieder_haes_eigentuemer_aktuell';

    pool.query(query, (err, results, fields) => {
        callback(err, results, fields);
    });
};


function getMitgliedByMitgliedInformation(mitglied, callback) {
    const { Name, Vorname, Adresse } = mitglied;
    const query = 'SELECT * FROM `mitglied` WHERE Name = ? AND Vorname = ? AND Strasse = ? AND Hausnummer = ? AND Postleitzahl = ? AND Ort = ? AND Land = ?';
    pool.query(query, [Name, Vorname, Adresse.Strasse, Adresse.Hausnummer, Adresse.Postleitzahl, Adresse.Ort, Adresse.Land], (err, results, fields) => {
        callback(err, results, fields);
    });
};

function getMitgliedByMitgliedsnummer(mitgliedsnummer, callback) {
    const query = 'SELECT * FROM `mitglied` WHERE Mitgliedsnummer = ?';
    pool.query(query, [mitgliedsnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
};

function getHaesEigentumByMitgliedInformation(mitglied, callback) {
    const { Name, Vorname, Geburtsdatum, Eintrittsdatum, Adresse } = mitglied;
    const query = 'SELECT * FROM `mitglieder_haes_eigentuemer_aktuell` WHERE Name = ? AND Vorname = ? AND Strasse = ? AND Hausnummer = ? AND Postleitzahl = ? AND Ort = ? AND Land = ?';

    pool.query(query, [Name, Vorname, Geburtsdatum, Eintrittsdatum, Adresse.Strasse, Adresse.Hausnummer, Adresse.Postleitzahl, Adresse.Ort, Adresse.Land], (err, results, fields) => {
        callback(err, results, fields);
    });
};

function addMitglied(mitglied, callback) {
    const { Name, Vorname, Geburtsdatum, Eintrittsdatum, Adresse } = mitglied;

    const query = 'INSERT INTO `mitglied`(Name, Vorname, Eintrittsdatum, Geburtsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';

    pool.query(query, [Name, Vorname, Eintrittsdatum, Geburtsdatum, Adresse.Strasse, Adresse.Hausnummer, Adresse.Postleitzahl, Adresse.Ort, Adresse.Land], (err, results, fields) => {
        callback(err, results, fields);
    });


};


module.exports = {
    getAllMitglieder,
    getAllMitgliederHaesEigentuemer,
    getMitgliedByMitgliedInformation,
    getMitgliedByMitgliedsnummer,
    getHaesEigentumByMitgliedInformation,
    addMitglied
};
