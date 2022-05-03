const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function UsuarioInicial() {
  Usuario.find({ rol: "Admin", usuario: "ADMIN" }, (err, usuarioEcontrado) => {
    if (usuarioEcontrado.length == 0) {
      bcrypt.hash("deportes123", null, null, (err, passwordEncriptada) => {
        Usuario.create({
          usuario: "ADMIN",
          password: passwordEncriptada,
          rol: "Admin",
        });
      });
    }
  });
}

function Login(req, res) {
  var parametros = req.body;
  Usuario.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (usuarioEncontrado) {
      // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
      bcrypt.compare(
        parametros.password,
        usuarioEncontrado.password,
        (err, verificacionPassword) => {
          //TRUE OR FALSE
          // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
          if (verificacionPassword) {
            // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
            if (parametros.obtenerToken === "true") {
              return res
                .status(200)
                .send({ token: jwt.crearToken(usuarioEncontrado) });
            } else {
              usuarioEncontrado.password = undefined;
              return  res.status(200)
              .send({ usuario: usuarioEncontrado })
            }
          } else {
            return res
              .status(500)
              .send({ mensaje: "Las contrasena no coincide" });
          }
        }
      );
    } else {
      return res
        .status(500)
        .send({ mensaje: "Error, el usuario no se encuentra registrado." });
    }
  });
}

function RegistrarUsuario(req, res) {
  var parametros = req.body;
  var usuarioModel = new Usuario();

  if (parametros.usuario && parametros.password) {
    usuarioModel.usuario = parametros.usuario;
    usuarioModel.rol = "Usuario";

    Usuario.find({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(
          parametros.password,
          null,
          null,
          (err, passwordEncriptada) => {
            usuarioModel.password = passwordEncriptada;

            usuarioModel.save((err, usuarioGuardado) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error en la peticion" });
              if (!usuarioGuardado)
                return res
                  .status(500)
                  .send({ mensaje: "Error al agregar el Usuario" });
              usuarioGuardado.carrito = undefined;
              return res.status(200).send({ usuario: usuarioGuardado });
            });
          }
        );
      } else {
        return res
          .status(500)
          .send({ mensaje: "Este usuario, ya  se encuentra registrado" });
      }
    });
  } else {
    return res
      .status(500)
      .send({ mensaje: "Debe rellenar los campos necesarios" });
  }
}


function RegistrarAdmin(req, res) {

  if(req.user.rol !="Administrador")
  return res.status(500).send({ mensaje: "no tiene autorización para ejecutar esta acción"})


  var parametros = req.body;
  var usuarioModel = new Usuario();

  if (parametros.usuario && parametros.password) {
    usuarioModel.usuario = parametros.usuario;
    usuarioModel.rol = "Admin";

    Usuario.find({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(
          parametros.password,
          null,
          null,
          (err, passwordEncriptada) => {
            usuarioModel.password = passwordEncriptada;

            usuarioModel.save((err, usuarioGuardado) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error en la peticion" });
              if (!usuarioGuardado)
                return res
                  .status(500)
                  .send({ mensaje: "Error al agregar el Usuario" });
              usuarioGuardado.carrito = undefined;
              return res.status(200).send({ usuario: usuarioGuardado });
            });
          }
        );
      } else {
        return res
          .status(500)
          .send({ mensaje: "Este usuario, ya  se encuentra registrado" });
      }
    });
  } else {
    return res
      .status(500)
      .send({ mensaje: "Debe rellenar los campos necesarios" });
  }
}

function EditarUsuario(req, res) {


  var parametros = req.body;

  let idUsuario;

  if (req.user.rol == "Usuario") {
    idUsuario = req.user.sub;
  } else if (req.user.rol == "Admin") {
    if (req.params.idUsuario == null) {
      return res.status(500).send({ mensaje: "debe enviar el id del usuario" });
    }
    idUsuario = req.params.idUsuario;
  }

  Usuario.findById(idUsuario, (err, usuarioEncontrado) => {

    if(req.user.rol != "Admin" && parametros.rol)
    return res
        .status(500)
        .send({ mensaje: "error, no tiene permiso para ejecutar esta acción" });

    if (usuarioEncontrado == null) {
      return res
        .status(500)
        .send({ mensaje: "error, no puede encontrar el usuario" });
    }

    if (usuarioEncontrado.rol == "Admin")
      return res
        .status(500)
        .send({ mensaje: "Error no puede editar a admins" });

    if (
      usuarioEncontrado.rol == "Usuario" &&
      parametros.rol &&
      parametros.rol != "Admin"
    )
      return res.status(500).send({ mensaje: "Error el rol no es valido" });

    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (!usuarioEncontrado)
      return res.status(500).send({ mensaje: "Error al encontrar el usuario" });

    Usuario.findByIdAndUpdate(
      idUsuario,
      parametros,
      { new: true },
      (err, usuarioActualizado) => {
        if (err)
          return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!usuarioActualizado)
          return res
            .status(500)
            .send({ mensaje: "Error al editar el Usuario" });
        return res.status(200).send({ usuario: usuarioActualizado });
      }
    );
  });
}

function EliminarUsuario(req, res) {
  let idUsuario;

  if (req.user.rol == "Usuario") {
    idUsuario = req.user.sub;
  } else if (req.user.rol == "Admin") {

    if (req.params.idUsuario == null) {
      return res
        .status(500)
        .send({ mensaje: "debe enviar el id del usuario" });
    }

    idUsuario = req.params.idUsuario;
  }

  Usuario.findById(idUsuario, (err, usuarioEncontrado) => {

    if (usuarioEncontrado == null) {
      return res
        .status(500)
        .send({ mensaje: "error, no puede encontrar el usuario" });
    }

    if (usuarioEncontrado.rol == "Admin")
      return res
        .status(500)
        .send({ mensaje: "Error no puede eliminar a admins" });

    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (!usuarioEncontrado)
      return res.status(500).send({ mensaje: "Error al encontrar el usuario" });

    Usuario.findByIdAndDelete(idUsuario, (err, usuarioActualizado) => {
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!usuarioActualizado)
        return res.status(500).send({ mensaje: "Error al editar el Usuario" });
      return res.status(200).send({ usuario: usuarioActualizado });
    });
  });
}



module.exports = {
  UsuarioInicial,
  Login,
  RegistrarUsuario,
  EditarUsuario,
  EliminarUsuario,
  RegistrarAdmin
};
