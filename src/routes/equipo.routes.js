const express = require('express');
const equipoControlador = require('../controllers/equipo.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/generarReporte/:liga/:idUsuario?', md_autenticacion.Auth, equipoControlador.generarReporte);

api.post('/crearEquipo/:liga/:idUsuario?', md_autenticacion.Auth, equipoControlador.crearEquipo);

api.put('/editarEquipo/:nombre/:idUsuario?', md_autenticacion.Auth, equipoControlador.editarEquipo);

api.delete('/eliminarEquipo/:nombre/:idUsuario?', md_autenticacion.Auth, equipoControlador.eliminarEquipo)

api.get('/verEquiposLiga/:liga/:idUsuario?', md_autenticacion.Auth, equipoControlador.verEquiposLiga);

api.get('/verTablaLiga/:liga/:idUsuario?', md_autenticacion.Auth, equipoControlador.tablaLiga);


module.exports = api;