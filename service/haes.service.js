const { pool } = require('../database-setup');

function getAllHaeser(callback) {
    pool.query('SELECT * FROM `aktuelle_haesbesitzer`', (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getAllMuckHaeser(callback) {
    pool.query('SELECT * FROM `aktuelle_haesbesitzer` WHERE HaesArt = "Muck"', (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getAllSpritzerHaeser(callback) {
    pool.query('SELECT * FROM `aktuelle_haesbesitzer` WHERE HaesArt = "Spritzer"', (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getMuckHaesByHaesnummer(haesnummer, callback) {
    pool.query('SELECT * FROM `aktuelle_haesbesitzer` WHERE HaesArt = "Muck" AND Haesnummer = ?', [haesnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getSpritzerHaesByHaesnummer(haesnummer, callback) {
    pool.query('SELECT * FROM `aktuelle_haesbesitzer` WHERE HaesArt = "Spritzer" AND Haesnummer = ?', [haesnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getMuckHaesHistoryByHaesnummer(haesnummer, callback) {
    pool.query('SELECT * FROM `alle_haesbesitzer_history` WHERE HaesArt = "Muck" AND Haesnummer = ?', [haesnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getSpritzerHaesHistoryByHaesnummer(haesnummer, callback) {
    pool.query('SELECT * FROM `alle_haesbesitzer_history` WHERE HaesArt = "Spritzer" AND Haesnummer = ?', [haesnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getHaesByID(haesID, callback) {
    pool.query('SELECT * FROM `alle_haesbesitzer_history` WHERE HaesID = ?', [haesID], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getMaxHaesnummer(haesArt, isKinderHaes, callback) {
    console.log(haesArt, isKinderHaes)
    pool.query('SELECT MAX(Haesnummer) AS maxHaesnummer FROM `haesnummern_haesart_istkinderhaes` WHERE HaesArt = ? AND IstKinderhaes = ?', [haesArt, isKinderHaes], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function addHaes(haesnummer, haesArt, istKinderhaes, herstellungsdatum, anzUmzuege, anmerkungen, eigentuemer, callback) {
    pool.query('INSERT INTO `Haes` (Haesnummer, HaesArt, IstKinderhaes, Herstellungsdatum, AnzUmzuegeBeiDBErstellung, Anmerkungen) VALUES (?, ?, ?, ?, ?, ?)', [haesnummer, haesArt, istKinderhaes, herstellungsdatum, anzUmzuege, anmerkungen], (err, results, fields) => {
        if(err) { 
            callback(err, results, fields);
        } else {
            const haesID = results.insertId;
            const zeitstempel = new Date().toISOString().split('T')[0];
            console.log(zeitstempel);
            addEigentum(haesID, eigentuemer, zeitstempel, (err, eigResults, eigFields) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, eigResults, eigFields);
                }
            });
        }
    });
}

function addEigentum(haesID, eigentuemer, zeitstempel, callback) {
    pool.query('INSERT INTO `Eigentum` (Haes, Eigentuemer, Zeitstempel) VALUES (?, ?, ?)', [haesID, eigentuemer, zeitstempel], (err, results, fields) => {
        callback(err, results, fields);
    });
}

module.exports = {
    getAllHaeser,
    getAllMuckHaeser,
    getAllSpritzerHaeser,
    getMuckHaesByHaesnummer,
    getSpritzerHaesByHaesnummer,
    getMuckHaesHistoryByHaesnummer,
    getSpritzerHaesHistoryByHaesnummer,
    getHaesByID,
    getMaxHaesnummer,
    addHaes,
    addEigentum
};