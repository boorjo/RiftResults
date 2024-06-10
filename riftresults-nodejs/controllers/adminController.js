const axios = require('axios');
var Cliente = require('../modelos/cliente');
var Publicacion = require('../modelos/publicacion');

module.exports = {
    //#region OPERACIONES ADMIN USUARIOS
    recuperarUsuarios: async (req, res, next) => {
        //recupera todos los usuarios de mi base de datos
        try {
            const usuarios = await Cliente.find();
            res.status(200).send({
                codigo: 0,
                mensaje: 'Usuarios recuperados correctamente',
                otrosdatos: usuarios
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al recuperar los usuarios',
                otrosdatos: null
            });
        }
    },
    eliminarUsuario: async (req, res, next) => {
        try {
            const { idusuario } = req.body;
            console.log('Req.body en eliminarUsuario...', req.body);
            const usuario = await Cliente.findByIdAndDelete(idusuario);
            if (!usuario) {
                res.status(200).send({
                    codigo: 1,
                    mensaje: 'Usuario no encontrado',
                    otrosdatos: null
                });
                return;
            }
            res.status(200).send({
                codigo: 0,
                mensaje: 'Usuario eliminado correctamente',
                otrosdatos: usuario
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al eliminar el usuario',
                otrosdatos: null
            });
        }
    },
    editarUsuario: async (req, res, next) => {
        try {
            const { idusuario, nombre, email, password, rol } = req.body;
            console.log('Req.body en editarUsuario...', req.body);
            const usuario = await Cliente.findById(idusuario);
            if (!usuario) {
                res.status(200).send({
                    codigo: 1,
                    mensaje: 'Usuario no encontrado',
                    otrosdatos: null
                });
                return;
            }
            usuario.nombre = nombre;
            usuario.email = email;
            usuario.password = password;
            usuario.rol = rol;
            await usuario.save();
            res.status(200).send({
                codigo: 0,
                mensaje: 'Usuario editado correctamente',
                otrosdatos: usuario
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al editar el usuario',
                otrosdatos: null
            });
        }
    }
    //#endregion

    //#region OPERACIONES ADMIN PUBLICACIONES


}