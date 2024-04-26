const mitgliedService = require('../service/mitglied.service');
const { timezone } = require('../config');


async function getAllMitglieder(req, res) {
    mitgliedService.getAllMitglieder(function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            console.log(results)
            res.json(formatMitgliederData(results));
        }
    });
}

async function getAllMitgliederHaesEigentuemer(req, res) {
    mitgliedService.getAllMitgliederHaesEigentuemer(function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getMitgliedByMitgliedInformation(req, res) {
    const { Name, Vorname, Geburtsdatum, Eintrittsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land } = req.body;

    const mitglied = createMitgliedObject(Name, Vorname, Geburtsdatum, Eintrittsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land);
    console.log(mitglied)

    mitgliedService.getMitgliedByMitgliedInformation(mitglied, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getMitgliedByMitgliedsnummer(req, res) {
    const mitgliedsnummer = req.params.mitgliedsnummer;
    mitgliedService.getMitgliedByMitgliedsnummer(mitgliedsnummer, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function getHaesEigentumByMitgliedInformation(req, res) {
    const { Name, Vorname, Geburtsdatum, Eintrittsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land } = req.body;

    const mitglied = createMitgliedObject(Name, Vorname, Geburtsdatum, Eintrittsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land);
    mitgliedService.getHaesEigentumByMitgliedInformation(mitglied, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

async function addMitglied(req, res) {
    console.log(req.body);
    const { name, vorname, geburtsdatum, eintrittsdatum, adresse } = req.body;

    const mitglied = createMitgliedObject(name, vorname, geburtsdatum, eintrittsdatum, adresse.strasse, adresse.hausnummer, adresse.postleitzahl, adresse.ort, adresse.land);

    mitgliedService.addMitglied(mitglied, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

function formatMitgliederData(data) {
    const haesMap = new Map();
    data.forEach(entry => {
        const { Mitgliedsnummer, Name, Vorname, Eintrittsdatum, Geburtsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land } = entry;
        if (!haesMap.has(Mitgliedsnummer)) {
            haesMap.set(Mitgliedsnummer, {
                Mitgliedsnummer,
                Name,
                Vorname,
                Eintrittsdatum,
                Geburtsdatum,
                Adresse: {
                    Strasse,
                    Hausnummer,
                    Postleitzahl,
                    Ort,
                    Land
                }
            });
        }
    });

    return Array.from(haesMap.values());
}

function formatMitgliedHaesEigentumResponse(response) {
    const formattedData = {};

    response.forEach(entry => {
        const { Mitgliedsnummer, Name, Vorname, Geburtsdatum, Eintrittsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land, Haesnummer, IstKinderhaes, HaesArt, Zeitstempel } = entry;

        if (!formattedData[Mitgliedsnummer]) {
            formattedData[Mitgliedsnummer] = {
                Mitgliedsnummer,
                Name,
                Vorname,
                Eintrittsdatum: new Date(Eintrittsdatum).toLocaleDateString(timezone),
                Geburtsdatum: new Date(Geburtsdatum).toLocaleDateString(timezone),
                Adresse: {
                    Strasse,
                    Hausnummer,
                    Postleitzahl,
                    Ort,
                    Land
                },
                Haes: []
            };
        }

        formattedData[Mitgliedsnummer].Haes.push({
            HaesArt: HaesArt,
            Haesnummer,
            Kinderhaes: IstKinderhaes,
            Zeitstempel,
            Eigentuemer_seit: new Date(Zeitstempel).toLocaleDateString(timezone)
        });
    });

    return Object.values(formattedData);
}


function formatMitgliedResponse(response) {
    const mitgliederFormatted = response.map(mitglied => {
        return {
            Mitgliedsnummer: mitglied.Mitgliedsnummer,
            Name: mitglied.Name,
            Vorname: mitglied.Vorname,
            Eintrittsdatum: new Date(mitglied.Eintrittsdatum).toLocaleDateString(timezone),
            Geburtsdatum: mitglied.Geburtsdatum ? new Date(mitglied.Geburtsdatum).toLocaleDateString(timezone) : null,
            Adresse: {
                Strasse: mitglied.Strasse,
                Hausnummer: mitglied.Hausnummer,
                Postleitzahl: mitglied.Postleitzahl,
                Ort: mitglied.Ort,
                Land: mitglied.Land
            }
        };
    });
}

function createMitgliedObject(name, vorname, geburtsdatum, eintrittsdatum, strasse, hausnummer, postleitzahl, ort, land) {
    return {
        Name: name,
        Vorname: vorname,
        Eintrittsdatum: eintrittsdatum,
        Geburtsdatum: geburtsdatum,
        Adresse: {
            Strasse: strasse,
            Hausnummer: hausnummer,
            Postleitzahl: postleitzahl,
            Ort: ort,
            Land: land
        }
    };
}



module.exports = {
    getAllMitglieder,
    getAllMitgliederHaesEigentuemer,
    getMitgliedByMitgliedInformation,
    getMitgliedByMitgliedsnummer,
    getHaesEigentumByMitgliedInformation,
    addMitglied
};
