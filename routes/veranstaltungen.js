var express = require('express');
var router = express.Router();
const { pool, timezone } = require('../database-setup')
const axios = require('axios');

router.get('/all', async (req, res) => {
    try {
        const query = `
        SELECT * FROM veranstaltungen`;
        const { rows } = await pool.query(query);

        const veranstaltungenFormatted = rows.map(veranstaltung => {
            return {
                VeranstaltungsID: veranstaltung.VeranstaltungsID,
                Ort: veranstaltung.Ort,
                Art: veranstaltung.Beschreibung,
                Datum: new Date(veranstaltung.Datum).toLocaleDateString(timezone),
                AnzTeilnehmer: veranstaltung.AnzUmzugsteilnehmer,
            };
        });

        res.json(veranstaltungenFormatted);
    } catch (err) {
        console.error('Fehler beim Abfragen der Veranstaltungen:', err);
        res.status(500).json({ message: 'Interner Serverfehler' });
    }
});

module.exports = router;
