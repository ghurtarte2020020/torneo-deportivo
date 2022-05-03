const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipoSchema = Schema({
    nombre: String,
    golesFavor: Number,
    golesContra: Number,
    diferenciaGoles: Number,
    partidosJugados: Number,
    puntos: Number,
    idUsuario: {type: Schema.Types.ObjectId, ref: 'Usuarios'},
    idLiga: {type: Schema.Types.ObjectId, ref: 'Liga'}
});

module.exports = mongoose.model('Equipos', EquipoSchema);