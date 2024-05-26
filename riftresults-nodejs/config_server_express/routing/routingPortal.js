const express=require('express');
const router=express.Router();

const portalController = require('../../controllers/portalController');


// ENDPOINTS
router.get('/RecuperarEquipos', portalController.recuperarEquipos);
router.post('/GetEquiposPorId', portalController.getEquiposPorId);
router.post('/AddEquipoFavorito', portalController.addEquipoFavorito);
router.post('/EliminarEquipoFavorito', portalController.eliminarEquipoFavorito);
router.post('/AddCampeonFavorito', portalController.addCampeonFavorito);
router.post('/EliminarCampeonFavorito', portalController.eliminarCampeonFavorito);

module.exports=router;