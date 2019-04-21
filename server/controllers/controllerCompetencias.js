var con = require('../../services/dbController');

getCompetencias = (req, res) => {
    con.query('SELECT * FROM competencia', (err, result, fields) => {
        if (err) throw err;

        res.send(result);
    });
}

getCompetencia = (req, res) => {
    con.query('SELECT * FROM competencia WHERE id = ?', [req.params.id], (err, result, fields) => {
        if (result.length === 0) {
            res.status(404).send("Competencia no valida");
        }
    });

    con.query('SELECT * FROM pelicula WHERE genero_id = (SELECT genero_id FROM competencia WHERE id = ?) ORDER BY rand() limit 2;', [req.params.id], (err, result, fields) => {
        let peliculasArray = []

        for (let i in result) {
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

votar = (req, res) => {
    //COMPLETAR VERIFICAR EXISTENCIA PELIUCLA ID Y COMPETENCIA ID
    con.query('INSERT INTO voto (pelicula_id, competencia_id) VALUES(?,?)', [req.body.idPelicula, req.params.id], (err, result) => {
        console.log(result);
    });

}

getResultados = (req, res) => {
    con.query("SELECT p.*, count(*) AS votos FROM pelicula AS p" +
    " INNER JOIN voto AS v" +
    " ON p.id = v.pelicula_id" +
    " INNER JOIN competencia AS c" +
    " ON v.competencia_id = c.id" +
    " WHERE c.id = ?" +
    " GROUP BY p.id" +
    " ORDER BY count(*) DESC" +
    " LIMIT 3;" , [req.params.id], (err, result, fields) => {
        
        let peliculasArray = []

        for (let i in result) {
            let pelicula = {
                id: result[i].id,
                poster: result[i].poster,
                titulo: result[i].titulo,
                votos: result[i].votos
            }
            peliculasArray.push(pelicula);
        }

        let data = {
            resultados: peliculasArray
        }

        res.send(data);
    });
}

module.exports = {
    getCompetencias,
    getCompetencia,
    votar,
    getResultados
}