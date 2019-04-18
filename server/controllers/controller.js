var con = require('../lib/dbController');

getCompetencias = (req, res) => {
    con.query('SELECT * FROM competencias', (err, result, fields) => {
        if (err) throw err;
        
        res.send(result);
    });
}

module.exports = {
    getCompetencias
}