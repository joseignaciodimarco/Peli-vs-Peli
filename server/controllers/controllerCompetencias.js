var con = require('../../services/dbController');

getCompetencias = (req, res) => {
    con.query('SELECT * FROM competencia', (err, result, fields) => {
        if (err) throw err;

        res.send(result);
    });
}

getCompetencia = (req, res) => {
    con.query('SELECT * FROM competencia WHERE id = ? ', [req.params.id], (err, resultCompetencia, fields) => {
        if (resultCompetencia.length === 0) {
            res.status(404).send("Competencia no valida");
            return;
        }

        let query = 'SELECT DISTINCT p.id, p.* FROM pelicula AS p' +
            ' JOIN genero AS g ON p.genero_id = g.id' +
            ' JOIN actor_pelicula AS ap ON p.id = ap.pelicula_id' +
            ' JOIN director_pelicula AS dp ON p.id = dp.pelicula_id' +
            ' WHERE 1 = 1 '

        if (resultCompetencia[0].genero_id) {
            query += ' AND g.id =  ' + resultCompetencia[0].genero_id
        }

        if (resultCompetencia[0].director_id) {
            query += ' AND dp.director_id =  ' + resultCompetencia[0].director_id
        }

        if (resultCompetencia[0].actor_id) {
            query += ' AND ap.actor_id =  ' + resultCompetencia[0].actor_id
        }

        query += ' ORDER BY rand() limit 2;'

        console.log(query);

        con.query(query, (err, result, fields) => {
            let peliculasArray = [];

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
    });

}

votar = (req, res) => {
    //COMPLETAR VERIFICAR EXISTENCIA PELIUCLA ID Y COMPETENCIA ID
    con.query('INSERT INTO voto (pelicula_id, competencia_id) VALUES(?,?)', [req.body.idPelicula, req.params.id], (err, result) => {
        console.log(result);
        res.status(200).send(`Voto cargado para la pelicula ${req.body.idPelicula}`);
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
        " LIMIT 3;", [req.params.id], (err, result, fields) => {

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

cargaCompetencia = (req, res) => {
    con.query('SELECT * FROM competencia WHERE nombre = ?', [req.body.nombre], (err, result, fields) => {
        if (result.length !== 0) {
            res.status(422).send("La competencia que desea cargar ya existe");
            return;
        }
    });

    let query = 'INSERT INTO competencia (nombre, genero_id, director_id, actor_id) VALUES ("' + req.body.nombre + '"';

    if (req.body.genero != 0) {
        query += ' , ' + req.body.genero;
    } else {
        query += ' , NULL';
    }

    if (req.body.director != 0) {
        query += ' , ' + req.body.director;
    } else {
        query += ' , NULL';
    }

    if (req.body.actor != 0) {
        query += ' , ' + req.body.actor;
    } else {
        query += ' , NULL';
    }

    query += ')';

    con.query(query, (err, result) => {
        console.log(result);
        res.status(200).send('Competencia cargada con exito');
        return;
    });
}

reiniciaCompetencia = (req, res) => {
    console.log(req.params);
    con.query('SELECT * FROM competencia WHERE id = ? ', [req.params.id], (err, result, fields) => {
        if (result.length === 0) {
            res.status(404).send("Competencia no valida");
            return;
        }
    });

    con.query('DELETE FROM voto WHERE competencia_id = ?', [req.params.id], (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.status(200).send('Competencia reiniciada con exito');
    });
}

getGeneros = (req, res) => {
    con.query('SELECT * FROM genero', (err, result, fields) => {
        let generosArray = [];

        for (let i in result) {
            let genero = {
                id: result[i].id,
                nombre: result[i].nombre
            }
            generosArray.push(genero);
        }

        res.send(generosArray);
    });
}

getDirectores = (req, res) => {
    con.query('SELECT * FROM director', (err, result, fields) => {
        let directoresArray = [];

        for (let i in result) {
            let director = {
                id: result[i].id,
                nombre: result[i].nombre
            }
            directoresArray.push(director);
        }

        res.send(directoresArray);
    });
}

getActores = (req, res) => {
    con.query('SELECT * FROM actor', (err, result, fields) => {
        let actoresArray = [];

        for (let i in result) {
            let actor = {
                id: result[i].id,
                nombre: result[i].nombre
            }
            actoresArray.push(actor);
        }

        res.send(actoresArray);
    });
}

deleteCompetencia = (req, res) => {
    con.query('DELETE FROM voto WHERE competencia_id = ?', [req.params.id], (err, result, fields) => {
        if (err) throw err;
        con.query('DELETE FROM competencia WHERE id = ?', [req.params.id], (err, result, fields) => {
            if (err) throw err;
            console.log(result);
            res.status(200).send('Competencia eliminada con exito');
        });
    });
}

updateCompetencia = (req, res) => {
    con.query('UPDATE competencia SET nombre = ? WHERE id = ?', [req.body.nombre, req.params.id], (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        res.status(200).send('Competencia editada con exito');
    });
}

getCompetenciaId = (req, res) => {
    let query = "SELECT c.nombre, g.nombre AS genero_nombre, d.nombre AS director_nombre, a.nombre AS actor_nombre  FROM competencia AS c" +
    " LEFT JOIN genero AS g ON c.genero_id = g.id"+
    " LEFT JOIN director AS d ON c.director_id = d.id"+
    " LEFT JOIN actor AS a ON c.actor_id = a.id"+
    " WHERE c.id = " + req.params.id
    con.query(query, (err, result, fields) => {
        if (err) throw err;

        let resultado = {
           nombre: result[0].nombre,
           genero_nombre: result[0].genero_nombre,
           director_nombre: result[0].director_nombre,
           actor_nombre: result[0].actor_nombre
        }
        
        res.status(200).send(resultado);
    });
}

module.exports = {
    getCompetencias,
    getCompetencia,
    votar,
    getResultados,
    cargaCompetencia,
    reiniciaCompetencia,
    getGeneros,
    getDirectores,
    getActores,
    deleteCompetencia,
    updateCompetencia,
    getCompetenciaId
}