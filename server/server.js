const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const controller = require('./controllers/controllerCompetencias');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/competencias', controller.getCompetencias);
app.get('/competencias/:id/peliculas', controller.getCompetencia);
app.get('/competencias/:id/resultados', controller.getResultados);
app.post('/competencias/:id/voto',controller.votar);

app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}`));