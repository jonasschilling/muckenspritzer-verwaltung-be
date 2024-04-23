var express = require('express');
var router = express.Router();
const { pool, timezone } = require('../database-setup')

router.get('/all', async (req, res) => {
  try {
    const query = `
        SELECT * FROM aktuelle_haesbesitzer`;
    
    const { rows } = await pool.query(query);

    res.json(formatHaesResponse(rows));
  } catch (err) {
    console.error('Fehler beim Abfragen der Häser:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/muck/all', async (req, res) => {
  try {
    const query = `
        SELECT * FROM aktuelle_haesbesitzer
        WHERE "Beschreibung" = 'Muck'`;
    
    const { rows } = await pool.query(query);

    res.json(rows);
  } catch (err) {
    console.error('Fehler beim Abfragen der Häser:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/spritzer/all', async (req, res) => {
  try {
    const query = `
        SELECT * FROM aktuelle_haesbesitzer
        WHERE "Beschreibung" = 'Spritzer'`;
    
    const { rows } = await pool.query(query);

    res.json(rows);
  } catch (err) {
    console.error('Fehler beim Abfragen der Häser:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/muck/:haesnummer', async (req, res) => {
  try {
    const { haesnummer } = req.params;
    if (!haesnummer) {
      return res.status(400).json({ message: 'Häsnummer ist erforderlich.' });
    }
    const query = `
        SELECT * FROM aktuelle_haesbesitzer
        WHERE "Beschreibung" = 'Muck' AND "Haesnummer" = $1`;
    
    const { rows } = await pool.query(query, [haesnummer]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Kein Eintrag gefunden.' });
    } else {
      res.json(formatHaesResponse(rows));
    }
  } catch (err) {
    console.error('Fehler beim Abfragen der Häser:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/spritzer/:haesnummer', async (req, res) => {
  try {
    const { haesnummer } = req.params;
    if (!haesnummer) {
      return res.status(400).json({ message: 'Häsnummer ist erforderlich.' });
    }
    const query = `
        SELECT * FROM aktuelle_haesbesitzer
        WHERE "Beschreibung" = 'Spritzer' AND "Haesnummer" = $1`;
    
    const { rows } = await pool.query(query, [haesnummer]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Kein Eintrag gefunden.' });
    } else {
      res.json(formatHaesResponse(rows));
    }
  } catch (err) {
    console.error('Fehler beim Abfragen der Häser:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/muck/:haesnummer/history', async (req, res) => {
  try {
    const { haesnummer } = req.params;
    if (!haesnummer) {
      return res.status(400).json({ message: 'Häsnummer ist erforderlich.' });
    }
    const query = `
        SELECT * FROM alle_haesbesitzer_history
        WHERE "Beschreibung" = 'Muck' AND "Haesnummer" = $1`;
    
    const { rows } = await pool.query(query, [haesnummer]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Kein Eintrag gefunden.' });
    } else {
      res.json(formatHaesHistoryResponse(rows));
    }
  } catch (err) {
    console.error('Fehler beim Abfragen der Häser:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/spritzer/:haesnummer/history', async (req, res) => {
  try {
    const { haesnummer } = req.params;
    if (!haesnummer) {
      return res.status(400).json({ message: 'Häsnummer ist erforderlich.' });
    }
    const query = `
        SELECT * FROM alle_haesbesitzer_history
        WHERE "Beschreibung" = 'Spritzer' AND "Haesnummer" = $1`;
    
    const { rows } = await pool.query(query, [haesnummer]);

    if (rows.length === 0) {
      res.status(404).json({ message: 'Kein Eintrag gefunden.' });
    } else {
      res.json(formatHaesHistoryResponse(rows));
    }
  } catch (err) {
    console.error('Fehler beim Abfragen der Häser:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

function formatHaesResponse(data) {
const formattedData = data.map(row => ({
        HaesID: row.HaesID,
        Art: row.Beschreibung,
        Haesnummer: row.Haesnummer,
        HaesArt: row.HaesArt,
        IstKinderhaes: row.IstKinderhaes,
        Herstellungsdatum: new Date(row.Herstellungsdatum).toLocaleDateString(timezone),
        AnzUmzuege: row.AnzUmzuege,
        Anmerkungen: row.Anmerkungen,
        Eigentuemer: {
          Name: row.Name,
          Vorname: row.Vorname,
          Eigentuemer_seit: new Date(row.Zeitstempel).toLocaleDateString(timezone),
          Adresse: {
            Strasse: row.Strasse,
            Hausnummer: row.Hausnummer,
            Postleitzahl: row.Postleitzahl,
            Ort: row.Ort
          }
        }
      }));

    return formattedData;
}

function formatHaesHistoryResponse(data) {
    const formattedData = {
        HaesID: data[0].HaesID,
        Art: data[0].Beschreibung,
        Haesnummer: data[0].Haesnummer,
        HaesArt: data[0].HaesArt,
        IstKinderhaes: data[0].IstKinderhaes,
        Herstellungsdatum: data[0].Herstellungsdatum,
        AnzUmzuege: data[0].AnzUmzuege,
        Anmerkungen: data[0].Anmerkungen,
        Eigentuemer: []
      };

      data.forEach(row => {
        formattedData.Eigentuemer.push({
          Name: row.Name,
          Vorname: row.Vorname,
          Eigentuemer_seit: new Date(row.Zeitstempel).toLocaleDateString(timezone),
          Adresse: {
            Strasse: row.Strasse,
            Hausnummer: row.Hausnummer,
            Postleitzahl: row.Postleitzahl,
            Ort: row.Ort
          }
        });
      });

    return formattedData;
}

module.exports = router;