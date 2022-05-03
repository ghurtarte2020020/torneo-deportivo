const express = require('express');
const partidoControlador = require('../controllers/partido.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/crearPartido/:liga/:idUsuario?', md_autenticacion.Auth, partidoControlador.crearPartido);

module.exports = api;