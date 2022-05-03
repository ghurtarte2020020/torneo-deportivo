const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LigaSchema = Schema({
    nombre: String,
    idUsuario: {type: Schema.Types.ObjectId, ref: 'Usuarios'}
});

module.exports = mongoose.model('Liga', LigaSchema);