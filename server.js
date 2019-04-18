const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const controller = require('./server/controllers/controller');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(bodyParser.json());

app.get('/competencias', controller.getCompetencias);

app.listen(8080, () => console.log('Server listening on port 8080'));