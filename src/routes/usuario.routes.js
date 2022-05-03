const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

api.post('/login', usuarioControlador.Login);

api.post('/registrarse', usuarioControlador.RegistrarUsuario);

api.post('/registrarAdmin', md_autenticacion.Auth, usuarioControlador.RegistrarAdmin);

api.put('/editarPerfil/:idUsuario?', md_autenticacion.Auth, usuarioControlador.EditarUsuario);

api.delete('/eliminarPerfil/:idUsuario?', md_autenticacion.Auth, usuarioControlador.EliminarUsuario)

module.exports = api;