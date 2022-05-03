const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuario.routes');
const LigaRutas = require('./src/routes/liga.routes')
const EquipoRutas = require('./src/routes/equipo.routes')
const PartidoRutas = require('./src/routes/partido.routes')

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas, LigaRutas, EquipoRutas, PartidoRutas);
module.exports = app;