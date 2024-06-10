const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema(
    {
        publicacionId: {type:String},
        titulo: { type: String, required: [true, '* Título obligatorio'], maxLength: [100, '* Máxima longitud para título 100 caracteres'] },
        contenido: { type: String, required: [true, '* Contenido obligatorio'], maxLength: [5000, '* Máxima longitud para contenido 5000 caracteres'] },
        categoria: { type: String, required: [true, '* Categoría obligatoria'], maxLength: [50, '* Máxima longitud para categoría 50 caracteres'] },
        usuarioId: { type: String, required: [true, '* ID Usuario obligatoria'], maxLength: [100, '* Máxima longitud para ID 100 caracteres'] },
        fecha: { type: Date, default: Date.now },
        comentarios: [{ autorId: String, fecha: Date, contenido: String }],
    }
);

module.exports = mongoose.model('Publicacion', publicacionSchema, 'publicaciones');
