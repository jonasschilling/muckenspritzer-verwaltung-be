const eigentumService = require('../service/eigentum.service');

async function addEigentum(req, res) {
    const haesID = req.body.Haes;
    const eigentuemer = req.body.Eigentuemer;
    const zeitstempel = req.body.Zeitstempel;
    eigentumService.addEigentum(haesID, eigentuemer, zeitstempel, function (err, results, fields) {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).json({ error: 'An error occurred while fetching data.' });
        } else {
            res.json(results);
        }
    });
}

module.exports = {
    addEigentum
}