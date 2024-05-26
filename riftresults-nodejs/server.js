//------------------- modulo principal de entrada app. nodejs config express con mongo ------------------------
// - definimos instancia de express
// - definimos instanica de mongo
// - lanzamos ambos servers...
require('dotenv').config(); //<---- paquete para definir como variables de entorno en fichero .env valores criticos, y recuperarlos con: process.env.nombre_variable
const express=require('express'); //<---en la variable express se almacena la funcion q genera el servidor web, exportada por el modulo 'express'
var serverExpress=express();

const mongoose=require('mongoose'); //<---- en la variable mongoose almacenamos objeto para manejar MONGODB como un ORM
const configServer=require('./config_server_express/config_pipeline'); 

//-----------------------------------------
serverExpress.listen(3000, ()=> console.log('...servidor web express escuchando por puerto 3000...') );
configServer(serverExpress);

//------------ conexion al servidor MONGODB----------
mongoose.connect(process.env.CONNECTION_MONGODB)
        .then(
            ()=> console.log('...conexion al servidor de BD mongo establecida de forma correcta...')
        )
        .catch(
          (err) => console.log('fallo al conectarnos al sevidor de bd de mongo:', err)  
        )