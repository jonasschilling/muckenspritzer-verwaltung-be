const { pool } = require('../database-setup');
const { addEigentum } = require('./eigentum.service');

function getAllHaeser(callback) {
    pool.query('SELECT * FROM `AktuelleHaesBesitzer`', async(err, results) => {
        if (err) return callback(err, null);

        try {
            await calculateAnzUmzuege(results);
            callback(null, results);
        } catch (error) {
            callback(error, null);
        }
    });
}

function getAllMuckHaeser(callback) {
    pool.query('SELECT * FROM `AktuelleHaesBesitzer` WHERE HaesArt = "Muck"', (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getAllSpritzerHaeser(callback) {
    pool.query('SELECT * FROM `AktuelleHaesBesitzer` WHERE HaesArt = "Spritzer"', (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getMuckHaesByHaesnummer(haesnummer, callback) {
    pool.query('SELECT * FROM `AktuelleHaesBesitzer` WHERE HaesArt = "Muck" AND Haesnummer = ?', [haesnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getSpritzerHaesByHaesnummer(haesnummer, callback) {
    pool.query('SELECT * FROM `AktuelleHaesBesitzer` WHERE HaesArt = "Spritzer" AND Haesnummer = ?', [haesnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getMuckHaesHistoryByHaesnummer(haesnummer, callback) {
    pool.query('SELECT * FROM `AlleHaesbesitzerHistory` WHERE HaesArt = "Muck" AND Haesnummer = ?', [haesnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getSpritzerHaesHistoryByHaesnummer(haesnummer, callback) {
    pool.query('SELECT * FROM `AlleHaesbesitzerHistory` WHERE HaesArt = "Spritzer" AND Haesnummer = ?', [haesnummer], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function getHaesByID(haesID, callback) {
    pool.query('SELECT * FROM `AlleHaesbesitzerHistory` WHERE HaesID = ?', [haesID], async(err, results) => {
        if (err) return callback(err, null);

        try {
            await calculateAnzUmzuege(results);
            callback(null, results);
        } catch (error) {
            callback(error, null);
        }
    });
}

function getMaxHaesnummer(haesArt, isKinderHaes, callback) {
    pool.query('SELECT MAX(Haesnummer) AS maxHaesnummer FROM `haesnummern_haesart_istkinderhaes` WHERE HaesArt = ? AND IstKinderhaes = ?', [haesArt, isKinderHaes], (err, results, fields) => {
        callback(err, results, fields);
    });
}

function addHaes(haesnummer, haesArt, istKinderhaes, herstellungsdatum, anzUmzuege, anmerkungen, eigentuemer, callback) {
    pool.query('INSERT INTO `Haes` (Haesnummer, HaesTypID, IstKinderhaes, Herstellungsdatum, AnzUmzuegeBeiDBErstellung, Anmerkungen) VALUES (?, ?, ?, ?, ?, ?)', [haesnummer, haesArt, istKinderhaes, herstellungsdatum, anzUmzuege, anmerkungen], (err, results, fields) => {
        if (err) {
            callback(err, results, fields);
        } else {
            const haesID = results.insertId;
            const zeitstempel = new Date().toISOString().split('T')[0];
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

function calculateAnzUmzuege(results) {
    const promises = results.map(element => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT COUNT(*) as ActAnzUmzuege FROM `HaesUmzugsTeilnahme` WHERE HaesID = ?', [element.HaesID],
                (err, queryResults) => {
                    if (err) return reject(err);
                    element.AnzUmzuege += queryResults[0].ActAnzUmzuege;
                    resolve();
                }
            );
        });
    });

    return Promise.all(promises);
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
    addHaes
};