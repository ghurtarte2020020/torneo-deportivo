const express = require('express');
const ligaControlador = require('../controllers/liga.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/crearLiga/:idUsuario?', md_autenticacion.Auth, ligaControlador.CrearLiga);

api.get('/verLigas/:idUsuario?', md_autenticacion.Auth, ligaControlador.visualizarLigas);

api.put('/editarLiga/:nombre/:idUsuario?', md_autenticacion.Auth, ligaControlador.editarLiga);

api.delete('/eliminarLiga/:nombre/:idUsuario?', md_autenticacion.Auth, ligaControlador.eliminarLiga)

module.exports = api;