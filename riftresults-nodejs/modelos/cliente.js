const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: [true, '* Nombre obligatario'], maxLength: [50, '* El nombre no puede ser tan largo'] },
        apellidos: { type: String, required: [true, '* Apellidos obligatorios'], maxLength: [100, '* Máxima longitud para apellidos 100 caracteres'] },
        cuenta: {
            email: { type: String, required: [true, '* Email obligatorio'], match: [new RegExp('^\\w+([\.-]?\\w+)*@\\w+([\.-]?\\w+)*(\.\\w{2,3})+$'), '* formato incorrecto del email'] },
            password: { type: String, required: [true, '* Password obligatoria'], match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])\S{8,}$/, '* En la password al menos una MAYS, MINS, NUMERO y caracter especial'] },
            cuentaActiva: { type: Boolean, required: true, default: false },
            login: { type: String, maxLength: [100, '* Longitud máxima del email 100 caracteres.'] },
            imagenAvatarBASE64: { type: String, default: '' },
            premium : { type: Boolean, default: false },
            esAdmin: { type: Boolean, default: false }
        },
        telefono: { type: String, match: [/^\d{3}(\s?\d{2}){3}$/, '* El telefono tiene que tener formato 666 11 22 33'] },
        pais: { type: String, required: [true, '* País obligatorio'], maxLength: [50, '* Máxima longitud para país 50 caracteres'] },
        datosLol: {
            rol: { type: String, required: [true, '* Rol obligatorio'], maxLength: [50, '* Máxima longitud para rol 50 caracteres'] },
            //equipos: [{ nombre: String, liga: String, division: String }],
            equiposId: [Number],
            //campeones: [ {nombre: String, titulo:String, descripcion: String, rol:String, imagen: String}],
            campeonesId: [String]
        }
    }
);

module.exports = mongoose.model('Cliente', clienteSchema, 'clientes');
