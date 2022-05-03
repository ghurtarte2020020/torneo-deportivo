const Equipo = require("../models/equipo.model");
const Liga = require("../models/liga.model");
const Partido = require("../models/partido.model");

function asignarEquipo(golFavor, golContra, idEquipo, idUsuario) {
    var punto = 0;

    if (golFavor > golContra || golContra == golFavor) {
        punto = 1;
    }

    Equipo.findOneAndUpdate({ _id: idEquipo, idUsuario: idUsuario }, { $inc: { golesFavor: golFavor, golesContra: golContra, puntos: punto, partidosJugados: 1 } }, { new: true }, (err, equipoActualizado) => {
        var diferencia = Math.abs(equipoActualizado.golesFavor-equipoActualizado.golesContra)

        Equipo.findOneAndUpdate({ _id: idEquipo, idUsuario: idUsuario},{diferenciaGoles: diferencia}, {new: true}, (err, diferenciaActualizada) => {
            console.log(diferenciaActualizada)
        })
       
    })
}

function crearPartido(req, res) {
    var parametros = req.body;
    var partidoModel = new Partido()
    var idUsuario;
    var idEquipo1;
    var idEquipo2;
    
    if (req.user.rol == "Usuario") {
        idUsuario = req.user.sub;
    } else if (req.user.rol == "Admin") {
        if (req.params.idUsuario == null) {
            return res.status(500).send({
                mensaje: "debe enviar el id del usuario al que quiere crear el partido",
            });
        }
        idUsuario = req.params.idUsuario;
    }

    if (req.params.liga == null) return res
        .status(500)
        .send({ mensaje: "Debe poner el nombre de la liga a la que quiere asignar el partido" });

    Liga.findOne({ nombre: req.params.liga }, (err, ligaEncontrada) => {
        if (!ligaEncontrada) {
            return res
                .status(500)
                .send({ mensaje: "no se ha encontrado la liga" });
        } else {
            Equipo.find({ idUsuario: idUsuario, idLiga: ligaEncontrada._id }, (err, equiposEncontrados) => {

                var jornadasMaximas;
                var partidosMaximos;

                if ((equiposEncontrados.length % 2) == 0) {
                    jornadasMaximas = (equiposEncontrados.length - 1)
                    partidosMaximos = (equiposEncontrados.length / 2)
                } else {
                    jornadasMaximas = equiposEncontrados.length
                    partidosMaximos = ((equiposEncontrados.length - 1) / 2)
                }

                if (parametros.equipo1 && parametros.equipo2 && parametros.goles1 && parametros.goles2 && parametros.jornada) {
                    if (parametros.jornada <= jornadasMaximas && parametros.jornada > 0) {
                        Partido.find({ jornada: parametros.jornada }, (err, partidosEncontrados) => {
                            if (partidosEncontrados.length < partidosMaximos) {
            
                                Equipo.findOne({ nombre: parametros.equipo1 }, (err, equipo1Encontrado) => {
                                    if (equipo1Encontrado) {
                                        idEquipo1 = equipo1Encontrado._id
                                        Equipo.findOne({ nombre: parametros.equipo2 }, (err, equipo2Encontrado) => {
                                            if (equipo2Encontrado) {
                                                idEquipo2 = equipo2Encontrado._id

                                                Partido.findOne({ idEquipo1: idEquipo1, jornada: parametros.jornada }, (err, partidoEncontrado) => {
                                                    if (!partidoEncontrado) {
                                                        Partido.findOne({ idEquipo2: idEquipo2, jornada: parametros.jornada }, (err, partidoEncontrado2) => {
                                                            if (!partidoEncontrado2) {
                                                                partidoModel.idEquipo1 = idEquipo1;
                                                                partidoModel.idEquipo2 = idEquipo2;
                                                                partidoModel.golesEquipo1 = parametros.goles1;
                                                                partidoModel.golesEquipo2 = parametros.goles2;
                                                                partidoModel.jornada = parametros.jornada;
                                                
                                                                partidoModel.save((err, partidoCreado) => {
                                                                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                                                    if (!partidoCreado)
                                                                        return res.status(500).send({ mensaje: "Error al crear el partido" });
                                                
                                                                    asignarEquipo(parametros.goles1, parametros.goles2, idEquipo1, idUsuario)
                                                
                                                                    asignarEquipo(parametros.goles2, parametros.goles1, idEquipo2, idUsuario)
                                                
                                                                    return res.status(200).send({ partido: partidoCreado });
                                                                })
                                                
                                                            } else {
                                                                return res.status(500).send({ error: "el equipo 2 ya jugó en esta jornada" })
                                                            }
                                                        })
                                                    } else {
                                                        return res.status(500).send({ error: "el equipo 1 ya jugó en esta jornada" })
                                                    }
                                                })
                                            } else {
                                                return res.status(500).send({ error: "el equipo no existe" })
                                            }
                                        })
                                    } else {
                                        return res.status(500).send({ error: "el equipo no existe" })
                                    }
                                })
                            } else {
                                return res.status(500).send({ error: "esta jornada está llena" })
                            }
                        })
                    } else {
                        return res.status(500).send({ error: "los valores de la jornada no son validos" })
                    }
            
                } else {
                    return res.status(500).send({ error: "debe llenar todos los parametros" })
                }

            })


        }
    })
}



module.exports = {
    crearPartido
}