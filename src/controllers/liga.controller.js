    const Liga = require("../models/liga.model");
function CrearLiga(req, res) {
    var parametros = req.body;
    var LigaModel = new Liga();
    var idUsuario;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere crearle la liga",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.findOne(
        { idUsuario: idUsuario, nombre: parametros.nombre },
        (err, ligaEncontrada) => {
            if (ligaEncontrada){
                return res.status(500).send({ eror: "la liga ya existe" });
            }

            if (parametros.nombre) {
                LigaModel.nombre = parametros.nombre;
                LigaModel.idUsuario = idUsuario;
        
                LigaModel.save((err, ligaCreada) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!ligaCreada)
                        return res.status(500).send({ mensaje: "Error al crear la liga" });
                    return res.status(200).send({ liga: ligaCreada });
                });
            } else {
                return res
                    .status(500)
                    .send({ mensaje: "Debe poner el nombre de la liga que desea crear" });
            }
          
        }
    );


}

function eliminarLiga(req, res) {
    if(req.params.nombre==null) return res.status(500).send({error: "debe enviar el nombre de la liga a la que eliminará"})
    var idUsuario;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere crearle la liga",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.findOneAndDelete(
        { nombre: req.params.nombre, idUsuario: idUsuario },
        (err, ligaEliminada) => {
            if (ligaEliminada == null)
                return res.status(500).send({ error: "no se encontró la liga" });
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

            return res.status(200).send({ liga: ligaEliminada });
        }
    );
}

function editarLiga(req, res) {
    var idUsuario;

    if(req.params.nombre==null) return res.status(500).send({error: "debe enviar el nombre de la liga a la que editará"})

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario que quiere editarle su liga",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.findOne({idUsuario: idUsuario, nombre: req.body.nombre}, (err, ligaRepetida)=> {
        if(ligaRepetida){
            return res.status(500).send({ error: "ya hay una liga con ese nombre, elija otro" });
        }else{
            Liga.findOneAndUpdate(
                { nombre: req.params.nombre, idUsuario: idUsuario },
                {nombre:req.body.nombre},
                { new: true },
                (err, ligaEditada) => {
                    if (ligaEditada == null)
                        return res.status(500).send({ error: "no se encontró la liga" });
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        
        
                    return res.status(200).send({ liga: ligaEditada });
                }
            );
        }
    })


}

function visualizarLigas(req, res) {
    var idUsuario;

    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje:
                    "debe enviar el id del usuario que quiere visualizar sus ligas",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    Liga.find({ idUsuario: idUsuario }, (err, ligasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (ligasEncontradas == null)
            return res.status(500).send({ eror: "No se encontraron ligas" });
        if (ligasEncontradas.length == 0)
            return res.status(500).send({ eror: "No cuenta con ligas" });

        return res.status(200).send({ ligas: ligasEncontradas });
    });
}


module.exports = {
    CrearLiga,
    editarLiga,
    eliminarLiga,
    visualizarLigas
  };