const { pool } = require('../database-setup');

function getAllMitglieder(callback) {
    const query = 'SELECT * FROM `Mitglied` ORDER BY Name, Vorname, Geburtsdatum';

    pool.query(query, (err, results, fields) => {
        callback(err, results, fields);
    });
};

function getAllMitgliederHaesEigentuemer(callback) {
    const query = 'SELECT * FROM Mitglieder_haes_eigentuemer_aktuell';

    pool.query(query, (err, results, fields) => {
        callback(err, results, fields);
    });
};


function getMitgliedByMitgliedInformation(Mitglied, callback) {
    const { Name, Vorname, Adresse } = Mitglied;
    const query = 'SELECT * FROM `Mitglied` WHERE Name = ? AND Vorname = ? AND Strasse = ? AND Hausnummer = ? AND Postleitzahl = ? AND Ort = ? AND Land = ?';
    pool.query(query, [Name, Vorname, Adresse.Strasse, Adresse.Hausnummer, Adresse.Postleitzahl, Adresse.Ort, Adresse.Land], (err, results, fields) => {
        callback(err, results, fields);
    });
};

function getMitgliedByMitgliedsnummer(Mitgliedsnummer, callback) {
    const query = 'SELECT * FROM `Mitglied` WHERE Mitgliedsnummer = ?';
    pool.query(query, [Mitgliedsnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
};

function getHaesEigentumByMitgliedInformation(Mitglied, callback) {
    const { Name, Vorname, Geburtsdatum, Eintrittsdatum, Adresse } = Mitglied;
    const query = 'SELECT * FROM `Mitglieder_haes_eigentuemer_aktuell` WHERE Name = ? AND Vorname = ? AND Strasse = ? AND Hausnummer = ? AND Postleitzahl = ? AND Ort = ? AND Land = ?';

    pool.query(query, [Name, Vorname, Geburtsdatum, Eintrittsdatum, Adresse.Strasse, Adresse.Hausnummer, Adresse.Postleitzahl, Adresse.Ort, Adresse.Land], (err, results, fields) => {
        callback(err, results, fields);
    });
};

function addMitglied(Mitglied, callback) {
    const { Name, Vorname, Geburtsdatum, Eintrittsdatum, Adresse } = Mitglied;

    const query = 'INSERT INTO `Mitglied`(Name, Vorname, Eintrittsdatum, Geburtsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';

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