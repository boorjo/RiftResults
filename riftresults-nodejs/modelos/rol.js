const mongoose = require('mongoose');

const rolSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: [true, '* Nombre obligatario'], maxLength: [50, '* El nombre no puede ser tan largo'] },
        img:    { type: String, required: [true, '* Imagen obligatoria'] },
    }
);

module.exports = mongoose.model('Rol', rolSchema, 'roles');
