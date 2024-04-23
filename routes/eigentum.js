var express = require('express');
var router = express.Router();
const { pool, timezone } = require('../database-setup')

router.post('/add', async (req, res) => {
    const { Haes, Eigentuemer, Zeitstempel } = req.body;
    try {
        const query = `
        INSERT INTO "Eigentum"("Haes", "Eigentuemer", "Zeitstempel") VALUES ($1, $2, $3);`;
        const { insertedRow } = await pool.query(query, [Haes, Eigentuemer, Zeitstempel]);

        return res.status(201).json({ message: 'Eigentum erfolgreich aktualisiert' });
    } catch (error) {
        console.error('Fehler beim Ändern des Eigentums:', error);
        res.status(500).json({ message: 'Interner Serverfehler' });
    }
});

module.exports = router;