const express=require('express');
const router=express.Router();

const portalController = require('../../controllers/portalController');


// ENDPOINTS
router.get('/RecuperarEquipos', portalController.recuperarEquipos);


module.exports=router;