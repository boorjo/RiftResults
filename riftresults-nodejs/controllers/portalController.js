const axios = require('axios');
var Cliente = require('../modelos/cliente');
var Publicacion = require('../modelos/publicacion');

module.exports = {
    recuperarEquipos: async (req, res, next) => {
        try {
            const url = `https://api.sportsdata.io/v3/lol/scores/json/Teams?key=${process.env.SPORTSDATA_APIKEY}`;
            const response = await axios.get(url);
            const teams = response.data;
            res.status(200).send({
                codigo: 0,
                mensaje: 'Equipos recuperados correctamente',
                otrosdatos: teams
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al recuperar los equipos',
                otrosdatos: null
            });
        }
    },
    getEquiposPorId: async (req, res, next) => {
        try {
            const url = `https://api.sportsdata.io/v3/lol/scores/json/Teams?key=${process.env.SPORTSDATA_APIKEY}`;
            console.log('Req.body en getEquiposPorId...', req.body);
            const ids = req.body;
            const response = await axios.get(url);
            const teams = response.data;
            // Filtrar los equipos por los IDs proporcionados
            const equiposPorId = teams.filter(equipo => ids.includes(equipo.TeamId));
            res.status(200).send({
                codigo: 0,
                mensaje: 'Equipos recuperados correctamente',
                otrosdatos: equiposPorId
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al recuperar los equipos',
                otrosdatos: null
            });
        }
    },
    addEquipoFavorito: async (req, res, next) => {
        try {
            const { idcliente, idequipo } = req.body;
            console.log('Req.body en addEquipoFavorito...', req.body);
            const cliente = await Cliente.findById(idcliente);
            if (!cliente) {
                res.status(200).send({
                    codigo: 1,
                    mensaje: 'Cliente no encontrado',
                    otrosdatos: null
                });
                return;
            }
            cliente.datosLol.equiposId.push(idequipo);
            await cliente.save();
            res.status(200).send({
                codigo: 0,
                mensaje: 'Equipo favorito agregado correctamente',
                otrosdatos: cliente
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al agregar el equipo favorito',
                otrosdatos: null
            });
        }
    },
    eliminarEquipoFavorito: async (req, res, next) => {
        try {
            const { idcliente, idequipo } = req.body;
            console.log('Req.body en eliminarEquipoFavorito...', req.body);
            const cliente = await Cliente.findById(idcliente);
            if (!cliente) {
                res.status(200).send({
                    codigo: 1,
                    mensaje: 'Cliente no encontrado',
                    otrosdatos: null
                });
                return;
            }
            cliente.datosLol.equiposId = cliente.datosLol.equiposId.filter(id => id !== idequipo);
            await cliente.save();
            res.status(200).send({
                codigo: 0,
                mensaje: 'Equipo favorito eliminado correctamente',
                otrosdatos: cliente
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al eliminar el equipo favorito',
                otrosdatos: null
            });
        }
    },
    addCampeonFavorito: async (req, res, next) => { 
        try {
            const { idcliente, idcampeon } = req.body;
            console.log('Req.body en addCampeonFavorito...', req.body);
            const cliente = await Cliente.findById(idcliente);
            if (!cliente) {
                res.status(200).send({
                    codigo: 1,
                    mensaje: 'Cliente no encontrado',
                    otrosdatos: null
                });
                return;
            }
            cliente.datosLol.campeonesId.push(idcampeon);
            await cliente.save();
            res.status(200).send({
                codigo: 0,
                mensaje: 'Campeón favorito agregado correctamente',
                otrosdatos: cliente
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al agregar el campeón favorito',
                otrosdatos: null
            });
        }
    },
    eliminarCampeonFavorito: async (req, res, next) => {
        try {
            const { idcliente, idcampeon } = req.body;
            console.log('Req.body en eliminarCampeonFavorito...', req.body);
            const cliente = await Cliente.findById(idcliente);
            if (!cliente) {
                res.status(200).send({
                    codigo: 1,
                    mensaje: 'Cliente no encontrado',
                    otrosdatos: null
                });
                return;
            }
            cliente.datosLol.campeonesId = cliente.datosLol.campeonesId.filter(id => id !== idcampeon);
            await cliente.save();
            res.status(200).send({
                codigo: 0,
                mensaje: 'Campeón favorito eliminado correctamente',
                otrosdatos: cliente
            });
        } catch (error) {
            console.error(error);
            res.status(200).send({
                codigo: 1,
                mensaje: 'Hubo un error al eliminar el campeón favorito',
                otrosdatos: null
            });
        }
    },
    guardarPublicacion: async (req, res, next) => {
        try {
            const publicacion = req.body;
            console.log('Req.body en guardarPublicacion...', req.body);
            if(publicacion.categoria === 'todo'){
                publicacion.categoria = 'social';
            }
            var _resultInsertPubli = await new Publicacion(publicacion).save();
            console.log('Resultado de insertar publicación en mongo...', _resultInsertPubli);

            res.status(200).send({
                codigo: 0,
                mensaje: 'Publicación guardada correctamente',
            });
        } catch (error) {
            console.log('error al hacer el insert en coleccion clientes...', error);
            res.status(200).send(
                {
                    codigo: 1,
                    mensaje: `error a la hora de insertar la publicación... ${JSON.stringify(error)}`
                }

            );
        }
    },
    obtenerPublicaciones: async (req, res, next) => {
        try {
            const categoria = req.query.categoria;
            let filtro = {};
            if (categoria && categoria !== 'todo') {
                filtro = { categoria };
            }

            const publicaciones = await Publicacion.find(filtro).sort({ fecha: -1 }); //ordenar x fecha..
            res.status(200).send({
                codigo: 0,
                mensaje: 'Publicaciones obtenidas correctamente',
                otrosdatos: publicaciones
            });
        } catch (error) {
            console.error('Error al obtener las publicaciones:', error);
            res.status(500).send({
                codigo: 1,
                mensaje: 'Hubo un error al obtener las publicaciones',
                otrosdatos: null
            });
        }
    },
    obtenerPublicacion: async (req, res, next) => {
        try {
          const id = req.params.id;
          const publicacion = await Publicacion.findById(id);
          if (!publicacion) {
            res.status(200).send({
              codigo: 1,
              mensaje: 'Publicación no encontrada',
              otrosdatos: null
            });
            return;
          }
          res.status(200).send({
            codigo: 0,
            mensaje: 'Publicación recuperada correctamente',
            otrosdatos: publicacion
          });
        } catch (error) {
          console.error('Error al recuperar la publicación:', error);
          res.status(200).send({
            codigo: 1,
            mensaje: 'Hubo un error al recuperar la publicación',
            otrosdatos: null
          });
        }
      },
      publicarComentario: async (req, res, next) => {
        try {
            console.log('req.body publicar...', req.body);
          const { publicacionId, comentario } = req.body;
          const publicacion = await Publicacion.findById(publicacionId);
          if (!publicacion) {
            res.status(200).send({
              codigo: 1,
              mensaje: 'Publicación no encontrada',
              otrosdatos: null
            });
            return;
          }
          publicacion.comentarios.push(comentario);
          await publicacion.save();
          res.status(200).send({
            codigo: 0,
            mensaje: 'Comentario publicado correctamente',
            otrosdatos: publicacion
          });
        } catch (error) {
          console.error(error);
          res.status(200).send({
            codigo: 1,
            mensaje: 'Hubo un error al publicar el comentario',
            otrosdatos: null
          });
        }
      }

}
