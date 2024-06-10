const express=require('express');
const router=express.Router(); //<----- objeto router a exportar...
const jsonwebtoken=require('jsonwebtoken');

const adminController=require('../../controllers/adminController');

async function checkJWT(req,res,next){
    try {
        //extraigo de la peticion, la cabecera "Authorization: Bearer ....jwt..."
        let _jwt=req.headers.authorization.split(' ')[1];
        console.log('JWT en cabecera mandado por cliente Angular...', _jwt);

        const _payload=await jsonwebtoken.verify(_jwt, process.env.JWT_SECRETKEY);
        req.payload=_payload;
        next(); //SI EL TOKEN ES CORRECTO, SE PASA AL SIGUIENTE MOD.MIDDLEWARE (next())

    } catch (error) {
        console.log('error al intentar comprobar el JWT enviado desde el cliente Angular...', error);
        res.status(401)
            .send(
                 {
                    codigo:1,
                    mensaje:'error al intentar comprobar el JWT enviado',
                    error:error.mensaje,
                    otrosdatos:null,
                    datoscliente:null,
                    jwt:null
                }
            );
    }
}

router.get('/RecuperarUsuarios', adminController.recuperarUsuarios);
router.post('/EliminarUsuario/:id', adminController.eliminarUsuario);
router.post('/EditarUsuario', adminController.editarUsuario);

module.exports=router;