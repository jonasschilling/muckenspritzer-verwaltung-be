const veranstaltungService = require('../service/veranstaltung.service');

function getAllVeranstaltungen(req, res) {
    veranstaltungService.getAllVeranstaltungen(function(err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

function getVeranstaltungInformationByID(req, res) {
    const veranstaltungsID = req.params.veranstaltungsID;
    veranstaltungService.getVeranstaltungInformationByID(veranstaltungsID, function(err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(formatVeranstaltungDetailData(results)[0]);
        }
    });
}

function formatVeranstaltungDetailData(data) {
    const veranstaltungenMap = new Map();
    data.forEach(entry => {
        const { VeranstaltungsID, Ort, Datum, Veranstaltungsart, HaesID, Haesart, IstKinderhaes, Haesnummer, Name, Vorname, AnzahlTeilnehmer } = entry;
        if (!veranstaltungenMap.has(VeranstaltungsID)) {
            veranstaltungenMap.set(VeranstaltungsID, {
                VeranstaltungsID,
                Ort,
                Datum,
                Veranstaltungsart: Veranstaltungsart,
                AnzahlTeilnehmer,
                Teilnehmer: []
            });
        }

        veranstaltungenMap.get(VeranstaltungsID).Teilnehmer.push({
            HaesID,
            Haesart,
            IstKinderhaes,
            Haesnummer,
            akt_Eigentuemer: {
                Name,
                Vorname
            }
        });
    });

    return Array.from(veranstaltungenMap.values());
}

async function addVeranstaltung(req, res) {
    const { eventArtID, eventDate, eventPlace } = req.body;

    const event = createveranstaltungObject(eventArtID, eventDate, eventPlace);

    veranstaltungService.addVeranstaltung(event, function(err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

function createveranstaltungObject(eventArtID, eventDate, eventPlace) {
    return {
        Datum: eventDate,
        Ort: eventPlace,
        VeranstaltungsArtID: eventArtID
    };
}


module.exports = {
    getAllVeranstaltungen,
    getVeranstaltungInformationByID,
    addVeranstaltung
}