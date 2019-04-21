var con = require('../../services/dbController');

getCompetencias = (req, res) => {
    con.query('SELECT * FROM competencia', (err, result, fields) => {
        if (err) throw err;

        res.send(result);
    });
}

getCompetencia = (req, res) => {
    con.query('SELECT * FROM competencia WHERE id = ?', [req.params.id], (err, result, fields) => {
        if(result.length === 0){
            res.status(404).send("Competencia no valida");
        }
    });

    con.query('SELECT * FROM pelicula WHERE genero_id = (SELECT genero_id FROM competencia WHERE id = ?) ORDER BY rand() limit 2;', [req.params.id], (err, result, fields) => {
        console.log(result);
        
        let peliculasArray = []

        for(let i in result){
            let pelicula = {
                id: result[i].id,
                poster: result[i].poster,
                titulo: result[i].titulo
            }
            peliculasArray.push(pelicula);
        }

        let opciones = {
            peliculas: peliculasArray
        }

        res.send(opciones);
    });

}

module.exports = {
    getCompetencias,
    getCompetencia
}