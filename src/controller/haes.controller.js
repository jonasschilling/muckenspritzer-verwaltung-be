const haesService = require('../service/haes.service');

function getAllHaeser(req, res) {
    haesService.getAllHaeser(function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(formatHaesData(results));
        }
    });
}

async function getAllMuckHaeser(req, res) {
    haesService.getAllMuckHaeser(function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getAllSpritzerHaeser(req, res) {
    haesService.getAllSpritzerHaeser(function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getMuckHaesByHaesnummer(req, res) {
    const haesnummer = req.params.haesnummer;
    haesService.getMuckHaesByHaesnummer(haesnummer, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getSpritzerHaesByHaesnummer(req, res) {
    const haesnummer = req.params.haesnummer;
    haesService.getSpritzerHaesByHaesnummer(haesnummer, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getMuckHaesHistoryByHaesnummer(req, res) {
    const haesnummer = req.params.haesnummer;
    haesService.getMuckHaesHistoryByHaesnummer(haesnummer, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getSpritzerHaesHistoryByHaesnummer(req, res) {
    const haesnummer = req.params.haesnummer;
    haesService.getSpritzerHaesHistoryByHaesnummer(haesnummer, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getHaesByID(req, res) {
    const haesID = req.params.haesID;
    haesService.getHaesByID(haesID, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(formatHaesDataWithEigentuemerHistory(results)[0]);
        }
    });
}

async function getMaxHaesnummer(req, res) {
    const haesArt = req.query.haesArt;
    const isKinderHaes = req.query.isKinderHaes;
    haesService.getMaxHaesnummer(haesArt, isKinderHaes, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results[0]);
        }
    });
}

async function addHaes(req, res) {
    const { haesnummer, haesArt, istKinderhaes, herstellungsdatum, anzUmzuege, anmerkungen, eigentuemer } = req.body;
    haesService.addHaes(haesnummer, haesArt, istKinderhaes, herstellungsdatum, anzUmzuege, anmerkungen, eigentuemer, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

function formatHaesData(data) {
    const haesMap = new Map();
    data.forEach(entry => {
        const { HaesID, Haesnummer, HaesArt, IstKinderhaes, Herstellungsdatum, AnzUmzuege, Anmerkungen, Mitgliedsnummer, Name, Vorname, Strasse, Hausnummer, Postleitzahl, Ort, Land, Zeitstempel } = entry;
        if (!haesMap.has(HaesID)) {
            haesMap.set(HaesID, {
                HaesID,
                Haesnummer,
                HaesArt,
                IstKinderhaes,
                Herstellungsdatum,
                AnzUmzuege,
                Anmerkungen,
                Eigentuemer: {
                    Mitgliedsnummer,
                    Name,
                    Vorname,
                    Adresse: {
                        Strasse,
                        Hausnummer,
                        Postleitzahl,
                        Ort,
                        Land
                    },
                    Eigentuemer_seit: Zeitstempel
                }
            });
        }
    });

    return Array.from(haesMap.values());
}

function formatHaesHistoryResponse(response) {

}

function formatHaesDataWithEigentuemerHistory(data) {
    const haesMap = new Map();
    data.forEach(entry => {
        const { HaesID, Haesnummer, HaesArt, IstKinderhaes, Herstellungsdatum, AnzUmzuege, Anmerkungen, Mitgliedsnummer, Name, Vorname, Strasse, Hausnummer, Postleitzahl, Ort, Land, Zeitstempel } = entry;
        if (!haesMap.has(HaesID)) {
            haesMap.set(HaesID, {
                HaesID,
                Haesnummer,
                HaesArt,
                IstKinderhaes,
                Herstellungsdatum,
                AnzUmzuege,
                Anmerkungen,
                Eigentuemer: []
            });
        }
        
        haesMap.get(HaesID).Eigentuemer.push({
            Mitgliedsnummer,
            Name,
            Vorname,
            Adresse: {
                Strasse,
                Hausnummer,
                Postleitzahl,
                Ort,
                Land
            },
            Eigentuemer_seit: Zeitstempel
        });
    });

    haesMap.forEach(haes => {
        haes.Eigentuemer.sort((a, b) => new Date(b.Eigentuemer_seit) - new Date(a.Eigentuemer_seit));
    });

    return Array.from(haesMap.values());
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