var express = require('express');
var router = express.Router();
const { pool, timezone } = require('../database-setup')


router.get('/all', async (req, res) => {
  try {
    const query = `
      SELECT "Mitgliedsnummer", "Name", "Vorname", "Eintrittsdatum", "Geburtsdatum", "Strasse", "Hausnummer", "Postleitzahl", "Ort", "Land" 
      FROM "Mitglied" M`;
    const { rows } = await pool.query(query);

    const mitgliederFormatted = rows.map(mitglied => {
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

    res.json(mitgliederFormatted);
  } catch (err) {
    console.error('Fehler beim Abfragen der Mitglieder:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/all/haes', async (req, res) => {
  try {
    const query = `SELECT * FROM mitglieder_haes_eigentuemer_aktuell`;

    const { rows } = await pool.query(query);

    res.json(formatData(rows));
  } catch (err) {
    console.error('Fehler beim Abfragen der Mitglieder:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { name, vorname } = req.body;
    if (!name || !vorname) {
      return res.status(400).json({ message: 'Name und Vorname sind erforderlich.' });
    }

    const query = `
      SELECT "Mitgliedsnummer", "Name", "Vorname", "Eintrittsdatum", "Geburtsdatum", "Strasse", "Hausnummer", "Postleitzahl", "Ort", "Land" 
      FROM "Mitglied" M 
      JOIN "Adresse" A ON M."Adresse" = A."AdressID"
      WHERE "Name" = '${name}' AND "Vorname" = '${vorname}'`;
    const { rows } = await pool.query(query);

    const mitgliederFormatted = rows.map(mitglied => {
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

    res.json(mitgliederFormatted);
  } catch (err) {
    console.error('Fehler beim Abfragen der Mitglieder:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.get('/haes', async (req, res) => {
  try {
    const { name, vorname } = req.body;
    if (!name || !vorname) {
      return res.status(400).json({ message: 'Name und Vorname sind erforderlich.' });
    }

    const query = `SELECT * FROM mitglieder_haes_eigentuemer_aktuell WHERE "Name" = '${name}' AND "Vorname" = '${vorname}'`;

    const { rows } = await pool.query(query);

    res.json(formatData(rows));
  } catch (err) {
    console.error('Fehler beim Abfragen der Mitglieder:', err);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

router.post('/add', async (req, res) => {
  const { name, vorname, geburtsdatum, eintrittsdatum, adresse } = req.body;
  try {
    const mitglied = {
      "name": name,
      "vorname": vorname,
      "geburtsdatum": geburtsdatum,
      "eintrittsdatum": eintrittsdatum,
      "adresse": {
        "strasse": adresse.strasse,
        "hausnummer": adresse.hausnummer,
        "postleitzahl": adresse.postleitzahl,
        "ort": adresse.ort,
        "land": adresse.land
      }
    };

    console.log("Mitglied", mitglied);
    const query = `
      INSERT INTO "Mitglied"("Name", "Vorname", "Eintrittsdatum", "Geburtsdatum", "Strasse", "Hausnummer", "Postleitzahl", "Ort", "Land") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;
    const { insertedRow } = await pool.query(query, [mitglied.name, mitglied.vorname, mitglied.eintrittsdatum, mitglied.geburtsdatum, mitglied.adresse.strasse, mitglied.adresse.hausnummer, mitglied.adresse.postleitzahl, mitglied.adresse.ort, mitglied.adresse.land]);

    return res.status(201).json({ message: 'Mitglied erfolgreich hinzugefügt' });
  } catch (error) {
    console.error('Fehler beim Anlegen des Mitglieds:', error);
    res.status(500).json({ message: 'Interner Serverfehler' });
  }
});

function formatData(data) {
  const formattedData = {};

  data.forEach(entry => {
    const { Mitgliedsnummer, Name, Vorname, Geburtsdatum, Eintrittsdatum, Strasse, Hausnummer, Postleitzahl, Ort, Land, Haesnummer, IstKinderhaes, HaesArt, Zeitstempel } = entry;

    if (!formattedData[Mitgliedsnummer]) {
      formattedData[Mitgliedsnummer] = {
        Mitgliedsnummer,
        Name,
        Vorname,
        Eintrittsdatum: new Date(Eintrittsdatum).toLocaleDateString(timezone),
        Geburtsdatum: new Date(Geburtsdatum).toLocaleDateString(timezone),
        Strasse,
        Hausnummer,
        Postleitzahl,
        Ort,
        Land,
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

module.exports = router;
