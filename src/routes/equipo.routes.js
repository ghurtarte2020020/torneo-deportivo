const express = require('express');
const equipoControlador = require('../controllers/equipo.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/crearEquipo/:liga/:idUsuario?', md_autenticacion.Auth, equipoControlador.crearEquipo);

api.put('/editarEquipo/:nombre/:idUsuario?', md_autenticacion.Auth, equipoControlador.editarEquipo);

api.delete('/eliminarEquipo/:nombre/:idUsuario?', md_autenticacion.Auth, equipoControlador.eliminarEquipo)

api.get('/verEquiposLiga/:liga/:idUsuario?', md_autenticacion.Auth, equipoControlador.verEquiposLiga);


module.exports = api;